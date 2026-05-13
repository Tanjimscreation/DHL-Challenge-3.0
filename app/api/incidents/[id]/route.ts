import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get incident with history
    const { data: incident, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    // Get incident history
    const { data: history, error: historyError } = await supabase
      .from('incident_history')
      .select('*')
      .eq('incident_id', id)
      .order('created_at', { ascending: true })

    if (historyError) {
      console.error('Failed to fetch history:', historyError)
    }

    return NextResponse.json({ incident, history: history || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params
    const body = await request.json()
    const { status, actor } = body

    if (!status || !actor) {
      return NextResponse.json(
        { error: 'Status and actor are required' },
        { status: 400 }
      )
    }

    // Update incident status
    const { data: incident, error } = await supabase
      .from('incidents')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update incident' },
        { status: 500 }
      )
    }

    // Add to history
    const { error: historyError } = await supabase
      .from('incident_history')
      .insert({
        incident_id: id,
        status,
        actor,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      })

    if (historyError) {
      console.error('Failed to create history entry:', historyError)
    }

    return NextResponse.json({ incident })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params

    // Delete incident history first
    await supabase
      .from('incident_history')
      .delete()
      .eq('incident_id', id)

    // Delete incident
    const { error } = await supabase
      .from('incidents')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete incident' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Incident deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
