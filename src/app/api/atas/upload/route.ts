/**
 * API Route: Upload Inteligente de PDF de ATA de Registro de Preço
 * 
 * POST /api/atas/upload
 * 
 * Recebe um arquivo PDF, faz o upload para o Supabase Storage,
 * usa IA para extrair os dados e cria automaticamente a ATA com lotes e itens.
 * 
 * Usa Server-Sent Events para enviar progresso em tempo real.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseAtaPDF, gerarSlugAta } from '@/lib/services/atas';
import { checkApiPermission } from '@/lib/permissions/middleware';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Tipos para as etapas de progresso
interface ProgressEvent {
    etapa: string;
    mensagem: string;
    progresso: number; // 0-100
    status: 'processando' | 'sucesso' | 'erro';
    dados?: Record<string, unknown>;
}

// Função para processar o upload (separada para evitar problemas com cookies no stream)
async function processarUpload(
    supabase: SupabaseClient<Database>,
    user: { id: string; email?: string },
    file: File,
    sendProgress: (event: ProgressEvent) => void
): Promise<void> {
    try {
        sendProgress({
            etapa: 'autenticacao',
            mensagem: `Autenticado como ${user.email || user.id}`,
            progresso: 10,
            status: 'sucesso',
        });

        // Converter File para Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        sendProgress({
            etapa: 'upload',
            mensagem: `Arquivo "${file.name}" recebido (${(buffer.length / 1024).toFixed(1)} KB)`,
            progresso: 20,
            status: 'sucesso',
        });

        // Extrair texto do PDF
        sendProgress({
            etapa: 'extracao',
            mensagem: 'Extraindo texto do PDF...',
            progresso: 25,
            status: 'processando',
        });

        // Fazer parsing do PDF com IA
        sendProgress({
            etapa: 'ia',
            mensagem: 'Analisando documento com Inteligência Artificial...',
            progresso: 35,
            status: 'processando',
        });

        const resultado = await parseAtaPDF(buffer, file.name);

        if (!resultado.sucesso || !resultado.dados) {
            sendProgress({
                etapa: 'ia',
                mensagem: resultado.erro || 'Erro ao processar o PDF',
                progresso: 40,
                status: 'erro',
                dados: { dados_parciais: resultado.dados },
            });
            return;
        }

        const dados = resultado.dados;

        // Preencher valores padrão
        if (!dados.fornecedor_nome) {
            dados.fornecedor_nome = 'Alfa Tecnologia em Engenharia e Infraestrutura de Redes Ltda.';
        }
        if (!dados.fornecedor_cnpj) {
            dados.fornecedor_cnpj = '31.837.899/0001-25';
        }
        if (!dados.modalidade) {
            dados.modalidade = 'Pregão Eletrônico';
        }

        const totalItensExtraidos = dados.lotes.reduce((acc, l) => acc + l.itens.length, 0);

        sendProgress({
            etapa: 'ia',
            mensagem: `Dados extraídos: ${dados.lotes.length} lote(s), ${totalItensExtraidos} item(ns)`,
            progresso: 50,
            status: 'sucesso',
            dados: {
                numero_ata: dados.numero_ata,
                orgao: dados.orgao_gerenciador_sigla || dados.orgao_gerenciador,
                lotes: dados.lotes.length,
                itens: totalItensExtraidos,
            },
        });

        // Gerar slug único
        sendProgress({
            etapa: 'validacao',
            mensagem: 'Validando dados e gerando identificadores...',
            progresso: 55,
            status: 'processando',
        });

        const slugBase = gerarSlugAta(dados.numero_ata, dados.orgao_gerenciador_sigla);

        const { data: existente } = await supabase
            .from('atas_registro_preco')
            .select('id, slug')
            .eq('slug', slugBase)
            .single();

        const slug = existente ? `${slugBase}-${Date.now()}` : slugBase;

        sendProgress({
            etapa: 'validacao',
            mensagem: 'Identificadores gerados',
            progresso: 60,
            status: 'sucesso',
        });

        // Upload do PDF para o Storage
        sendProgress({
            etapa: 'storage',
            mensagem: 'Salvando PDF no armazenamento...',
            progresso: 65,
            status: 'processando',
        });

        const timestamp = Date.now();
        // Sanitizar nome do arquivo removendo caracteres especiais
        const sanitizedFileName = file.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}-${sanitizedFileName}`;

        console.log('Tentando upload para storage:', {
            bucket: 'atas-documentos',
            fileName,
            contentType: 'application/pdf',
            bufferSize: buffer.length,
        });

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('atas-documentos')
            .upload(fileName, buffer, {
                contentType: 'application/pdf',
                upsert: false,
            });

        if (uploadError) {
            console.error('Erro detalhado do storage:', uploadError);
            sendProgress({
                etapa: 'storage',
                mensagem: `Erro ao salvar arquivo: ${uploadError.message}`,
                progresso: 65,
                status: 'erro',
                dados: {
                    erro: uploadError.message,
                    fileName,
                    bufferSize: buffer.length,
                },
            });
            return;
        }

        console.log('Upload bem sucedido:', uploadData);

        const { data: urlData } = supabase.storage
            .from('atas-documentos')
            .getPublicUrl(fileName);

        sendProgress({
            etapa: 'storage',
            mensagem: 'PDF salvo com sucesso',
            progresso: 70,
            status: 'sucesso',
        });

        // Criar registro da ATA
        sendProgress({
            etapa: 'banco',
            mensagem: 'Criando registro da ATA no banco de dados...',
            progresso: 75,
            status: 'processando',
        });

        const { data: ata, error: ataError } = await supabase
            .from('atas_registro_preco')
            .insert({
                slug,
                numero_ata: dados.numero_ata,
                orgao_gerenciador: dados.orgao_gerenciador,
                orgao_gerenciador_sigla: dados.orgao_gerenciador_sigla,
                modalidade: dados.modalidade,
                numero_planejamento: dados.numero_planejamento,
                vigencia_meses: dados.vigencia_meses,
                status: 'vigente',
                objeto: dados.objeto,
                fornecedor_nome: dados.fornecedor_nome,
                fornecedor_cnpj: dados.fornecedor_cnpj,
                base_legal: dados.base_legal,
                data_inicio: dados.data_inicio,
                data_fim: dados.data_fim,
                pdf_ata_url: urlData.publicUrl,
                pdf_ata_nome: file.name,
                ativo: true,
                destaque_home: false,
            })
            .select()
            .single();

        if (ataError) {
            sendProgress({
                etapa: 'banco',
                mensagem: 'Erro ao criar registro da ATA: ' + ataError.message,
                progresso: 75,
                status: 'erro',
            });
            return;
        }

        sendProgress({
            etapa: 'banco',
            mensagem: 'Registro da ATA criado',
            progresso: 80,
            status: 'sucesso',
        });

        // Criar lotes e itens
        sendProgress({
            etapa: 'lotes',
            mensagem: `Criando ${dados.lotes.length} lote(s)...`,
            progresso: 85,
            status: 'processando',
        });

        let totalItens = 0;
        let lotesProcessados = 0;

        for (const lote of dados.lotes) {
            const { data: loteDb, error: loteError } = await supabase
                .from('ata_lotes')
                .insert({
                    ata_id: ata.id,
                    numero: lote.numero,
                    descricao: lote.descricao,
                    ativo: true,
                })
                .select()
                .single();

            if (loteError) {
                console.error('Erro ao criar lote:', loteError);
                continue;
            }

            lotesProcessados++;

            // Criar itens do lote
            if (lote.itens.length > 0) {
                sendProgress({
                    etapa: 'itens',
                    mensagem: `Criando ${lote.itens.length} itens do Lote ${lote.numero}...`,
                    progresso: 85 + (lotesProcessados / dados.lotes.length) * 10,
                    status: 'processando',
                });

                const itensParaInserir = lote.itens.map((item, index) => ({
                    ata_id: ata.id,
                    lote_id: loteDb.id,
                    numero_item: item.numero_item,
                    descricao: item.descricao,
                    unidade: item.unidade,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco_unitario,
                    ordem: index,
                    ativo: true,
                }));

                const { error: itensError } = await supabase
                    .from('ata_itens')
                    .insert(itensParaInserir);

                if (!itensError) {
                    totalItens += itensParaInserir.length;
                }
            }
        }

        sendProgress({
            etapa: 'itens',
            mensagem: `${totalItens} itens criados em ${lotesProcessados} lote(s)`,
            progresso: 95,
            status: 'sucesso',
        });

        // Finalizado com sucesso
        sendProgress({
            etapa: 'finalizado',
            mensagem: 'ATA processada e cadastrada com sucesso!',
            progresso: 100,
            status: 'sucesso',
            dados: {
                ata_id: ata.id,
                slug: ata.slug,
                numero_ata: dados.numero_ata,
                orgao: dados.orgao_gerenciador_sigla || dados.orgao_gerenciador,
                fornecedor: dados.fornecedor_nome,
                lotes: lotesProcessados,
                itens: totalItens,
            },
        });

    } catch (error) {
        console.error('Erro no processamento:', error);
        sendProgress({
            etapa: 'erro',
            mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
            progresso: 0,
            status: 'erro',
        });
    }
}

export async function POST(request: NextRequest) {
    // Verificar permissão para criar atas
    const { authorized, userId, error } = await checkApiPermission(request, 'atas', 'create')
    if (!authorized) {
        return new Response(
            JSON.stringify({ error: 'Sem permissão para criar atas' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Criar cliente Supabase ANTES do stream (para ter acesso aos cookies)
    const supabase = await createClient();

    // Verificar autenticação ANTES do stream
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return new Response(
            JSON.stringify({ error: 'Não autorizado', details: authError?.message }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Obter arquivo do FormData ANTES do stream
    let file: File;
    try {
        const formData = await request.formData();
        const uploadedFile = formData.get('file') as File | null;

        if (!uploadedFile) {
            return new Response(
                JSON.stringify({ error: 'Arquivo PDF não fornecido' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!uploadedFile.type.includes('pdf')) {
            return new Response(
                JSON.stringify({ error: 'Apenas arquivos PDF são aceitos' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        file = uploadedFile;
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Erro ao processar formulário' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Criar um stream de resposta
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            // Função helper para enviar eventos SSE
            const sendProgress = (event: ProgressEvent) => {
                const data = `data: ${JSON.stringify(event)}\n\n`;
                controller.enqueue(encoder.encode(data));
            };

            // Enviar evento inicial
            sendProgress({
                etapa: 'autenticacao',
                mensagem: 'Verificando autenticação...',
                progresso: 5,
                status: 'processando',
            });

            // Processar o upload
            await processarUpload(supabase, user, file, sendProgress);

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
