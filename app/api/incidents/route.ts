import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get all incidents
    const { data: incidents, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch incidents' },
        { status: 500 }
      )
    }

    return NextResponse.json({ incidents })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate required fields
    const { title, description, department, severity, reporter_name, reporter_role, reporter_id, recommended_action, attachments = [] } = body
    
    if (!title || !description || !department || !severity || !reporter_name || !reporter_role || !reporter_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate incident ID
    const incidentId = `INC-${Date.now().toString().slice(-6)}`

    // Create incident
    const { data: incident, error: incidentError } = await supabase
      .from('incidents')
      .insert({
        id: incidentId,
        title,
        description,
        department,
        severity,
        status: 'Open',
        reporter_name,
        reporter_role,
        reporter_id,
        recommended_action,
        attachments,
        duplicate: false,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (incidentError) {
      return NextResponse.json(
        { error: 'Failed to create incident' },
        { status: 500 }
      )
    }

    // Create initial history entry
    const { error: historyError } = await supabase
      .from('incident_history')
      .insert({
        incident_id: incidentId,
        status: 'Open',
        actor: reporter_name,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      })

    if (historyError) {
      console.error('Failed to create history entry:', historyError)
    }

    return NextResponse.json({ incident }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
