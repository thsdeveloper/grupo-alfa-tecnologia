/**
 * API Route: Detalhes de um Termo de Referência
 * 
 * GET /api/termos/[id] - Retorna detalhes do termo com grupos e itens
 * DELETE /api/termos/[id] - Remove o termo e todos os dados relacionados
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
    
    // Buscar grupos com itens
    const { data: grupos, error: gruposError } = await supabase
      .from('termo_grupos')
      .select(`
        *,
        termo_itens (
          *,
          termo_itens_normalizados (*),
          termo_sugestoes (
            *,
            equipamentos (*)
          )
        )
      `)
      .eq('termo_id', id)
      .order('numero', { ascending: true })
    
    if (gruposError) {
      console.error('Erro ao buscar grupos:', gruposError)
    }
    
    // Buscar logs de processamento
    const { data: logs } = await supabase
      .from('process_logs')
      .select('*')
      .eq('termo_id', id)
      .order('created_at', { ascending: false })
      .limit(20)
    
    return NextResponse.json({
      termo,
      grupos: grupos || [],
      logs: logs || [],
    })
    
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    
    // Verificar se o termo existe e pertence ao usuário
    const { data: termo, error: termoError } = await supabase
      .from('termos')
      .select('id, pdf_url, user_id')
      .eq('id', id)
      .single()
    
    if (termoError || !termo) {
      return NextResponse.json(
        { error: 'Termo não encontrado' },
        { status: 404 }
      )
    }
    
    if (termo.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Não autorizado a excluir este termo' },
        { status: 403 }
      )
    }
    
    // Remover arquivo do Storage (se existir)
    if (termo.pdf_url) {
      const path = termo.pdf_url.split('/termos-pdfs/').pop()
      if (path) {
        await supabase.storage.from('termos-pdfs').remove([path])
      }
    }
    
    // Deletar termo (cascade remove grupos, itens, etc.)
    const { error: deleteError } = await supabase
      .from('termos')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('Erro ao deletar:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir termo' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Termo excluído com sucesso',
    })
    
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

