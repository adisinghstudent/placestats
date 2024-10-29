import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const filePath = path.join(process.cwd(), 'data.json')
    
    const fileContent = {
      currentLocation: {
        longitude: data.longitude,
        latitude: data.latitude
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save location' }, { status: 500 })
  }
}
