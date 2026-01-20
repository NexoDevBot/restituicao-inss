import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cpf = searchParams.get('cpf')

    if (!cpf) {
      return NextResponse.json(
        { error: 'CPF não fornecido' },
        { status: 400 }
      )
    }

    console.log('Consultando CPF:', cpf)

    // Faz a requisição para a API externa (server-side, sem CORS)
    const apiUrl = `https://consultas.smart-nexus.net/cpf/${cpf}?token=31c14a8443fe43e884c642b5513f5b24`
    console.log('URL da API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Status da resposta:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro da API externa:', errorText)
      return NextResponse.json(
        { 
          error: 'Erro ao consultar CPF na API externa',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Dados recebidos:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API Route:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno ao processar a consulta',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
