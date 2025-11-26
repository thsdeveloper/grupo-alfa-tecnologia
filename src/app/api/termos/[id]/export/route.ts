/**
 * API Route: Exportar Termo de Referência
 * 
 * GET /api/termos/[id]/export?format=csv|json
 * 
 * Exporta os itens do termo com as sugestões de equipamentos
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Parâmetros
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    
    // Buscar termo
    const { data: termo, error: termoError } = await supabase
      .from('termos')
      .select('*')
      .eq('id', id)
      .single()
    
    if (termoError || !termo) {
      return NextResponse.json(
        { error: 'Termo não encontrado' },
        { status: 404 }
      )
    }
    
    // Buscar itens com sugestões
    const { data: itens, error: itensError } = await supabase
      .from('termo_itens')
      .select(`
        numero_item,
        descricao_bruta,
        unidade,
        quantidade,
        valor_estimado,
        status,
        termo_grupos (nome),
        termo_itens_normalizados (categoria, formato, tecnologia, observacoes),
        termo_sugestoes (
          is_principal,
          aderencia_percentual,
          comentario,
          confirmado_por_usuario,
          equipamentos (
            nome_comercial,
            fabricante,
            preco_venda
          )
        )
      `)
      .eq('termo_id', id)
      .order('numero_item', { ascending: true })
    
    if (itensError) {
      return NextResponse.json(
        { error: 'Erro ao buscar itens' },
        { status: 500 }
      )
    }
    
    // Formatar dados para exportação
    const dadosExportacao = (itens || []).map(item => {
      const grupo = item.termo_grupos as { nome: string } | null
      const normalizado = item.termo_itens_normalizados as {
        categoria: string
        formato: string
        tecnologia: string
        observacoes: string
      } | null
      
      // Encontrar sugestão principal
      const sugestoes = item.termo_sugestoes as Array<{
        is_principal: boolean
        aderencia_percentual: number
        comentario: string
        confirmado_por_usuario: boolean
        equipamentos: {
          nome_comercial: string
          fabricante: string
          preco_venda: number
        }
      }>
      
      const sugestaoPrincipal = sugestoes?.find(s => s.is_principal)
      const equipamento = sugestaoPrincipal?.equipamentos
      
      return {
        grupo: grupo?.nome || '',
        numero_item: item.numero_item,
        descricao_original: item.descricao_bruta,
        unidade: item.unidade,
        quantidade: item.quantidade,
        valor_estimado: item.valor_estimado,
        categoria_identificada: normalizado?.categoria || '',
        formato_identificado: normalizado?.formato || '',
        tecnologia_identificada: normalizado?.tecnologia || '',
        observacoes_ia: normalizado?.observacoes || '',
        equipamento_sugerido: equipamento?.nome_comercial || '',
        fabricante: equipamento?.fabricante || '',
        preco_unitario: equipamento?.preco_venda || '',
        preco_total: equipamento?.preco_venda 
          ? (equipamento.preco_venda * (item.quantidade || 1)).toFixed(2) 
          : '',
        aderencia: sugestaoPrincipal?.aderencia_percentual 
          ? `${(sugestaoPrincipal.aderencia_percentual * 100).toFixed(0)}%` 
          : '',
        comentario_sugestao: sugestaoPrincipal?.comentario || '',
        confirmado: sugestaoPrincipal?.confirmado_por_usuario ? 'Sim' : 'Não',
        status: item.status,
      }
    })
    
    if (format === 'json') {
      return NextResponse.json({
        termo: {
          nome: termo.nome,
          numero_edital: termo.numero_edital,
          orgao: termo.orgao,
          total_itens: termo.total_itens,
          total_grupos: termo.total_grupos,
        },
        itens: dadosExportacao,
      })
    }
    
    // Formato CSV
    const headers = [
      'Grupo',
      'Item',
      'Descrição Original',
      'Unidade',
      'Quantidade',
      'Valor Estimado',
      'Categoria',
      'Formato',
      'Tecnologia',
      'Observações IA',
      'Equipamento Sugerido',
      'Fabricante',
      'Preço Unitário',
      'Preço Total',
      'Aderência',
      'Comentário',
      'Confirmado',
      'Status',
    ]
    
    const csvRows = [
      headers.join(';'),
      ...dadosExportacao.map(item => [
        `"${item.grupo}"`,
        item.numero_item,
        `"${item.descricao_original.replace(/"/g, '""')}"`,
        item.unidade,
        item.quantidade,
        item.valor_estimado || '',
        item.categoria_identificada,
        item.formato_identificado,
        item.tecnologia_identificada,
        `"${(item.observacoes_ia || '').replace(/"/g, '""')}"`,
        `"${item.equipamento_sugerido}"`,
        `"${item.fabricante}"`,
        item.preco_unitario,
        item.preco_total,
        item.aderencia,
        `"${(item.comentario_sugestao || '').replace(/"/g, '""')}"`,
        item.confirmado,
        item.status,
      ].join(';')),
    ]
    
    const csvContent = csvRows.join('\n')
    const fileName = `termo-${termo.nome.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.csv`
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
    
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

