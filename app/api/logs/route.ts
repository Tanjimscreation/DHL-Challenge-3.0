import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { action, file_name, status, message } = body

    if (!action || !status) {
      return NextResponse.json(
        { error: 'Action and status are required' },
        { status: 400 }
      )
    }

    // Create log entry
    const { data: log, error } = await supabase
      .from('logs')
      .insert({
        action,
        file_name: file_name || null,
        status,
        message: message || '',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create log entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
