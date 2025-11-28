/**
 * API Route: Listar Termos de Referência
 * 
 * GET /api/termos - Lista todos os termos do usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkApiPermission } from '@/lib/permissions/middleware'

export async function GET(request: NextRequest) {
  try {
    // Verificar permissão para visualizar termos
    const { authorized, error } = await checkApiPermission(request, 'termos', 'view')
    if (!authorized) {
      return error!
    }
    
    const supabase = await createClient()
    
    // Parâmetros de paginação
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const status = searchParams.get('status')
    
    const offset = (page - 1) * limit
    
    // Query base
    let query = supabase
      .from('termos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Filtrar por status se fornecido
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: termos, error: termosError, count } = await query
    
    if (termosError) {
      console.error('Erro ao buscar termos:', termosError)
      return NextResponse.json(
        { error: 'Erro ao buscar termos' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      termos: termos || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
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

