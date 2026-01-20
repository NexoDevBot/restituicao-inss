'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

function ResultadoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [dadosConsulta, setDadosConsulta] = useState<any>(null)
  const [valorDisponivel, setValorDisponivel] = useState<number>(0)

  useEffect(() => {
    const dadosParam = searchParams.get('dados')
    
    if (dadosParam) {
      try {
        const dados = JSON.parse(decodeURIComponent(dadosParam))
        setDadosConsulta(dados)
        
        // Gera valor aleatório entre 3000 e 15000
        const valorAleatorio = Math.floor(Math.random() * (15000 - 3000 + 1)) + 3000
        setValorDisponivel(valorAleatorio)
      } catch (error) {
        console.error('Erro ao processar dados:', error)
      }
    }
  }, [searchParams])

  // Função para formatar data de nascimento (YYYY-MM-DD para DD/MM/YYYY)
  const formatarDataNascimento = (dataApi: string): string => {
    // A API retorna no formato "YYYY-MM-DD HH:MM:SS"
    const data = dataApi.split(' ')[0] // Pega apenas a parte da data
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  const handleNovaConsulta = () => {
    router.push('/')
  }

  const handleRecebaAgora = () => {
    // Redireciona para página de recebimento com os dados
    const params = new URLSearchParams({
      valor: valorDisponivel.toString(),
      cpf: dadosConsulta?.pessoa?.identificacao?.cpf || '',
      nome: dadosConsulta?.pessoa?.identificacao?.nome || ''
    })
    router.push(`/recebimento?${params.toString()}`)
  }

  if (!dadosConsulta) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    )
  }

  const pessoa = dadosConsulta?.pessoa?.identificacao

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header com Logo */}
      <header className="bg-white shadow-sm py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <img
            src="https://blog.flaviarita.com/wp-content/uploads/2018/08/logo-INSS-2.png"
            alt="Logo INSS"
            className="h-32 sm:h-40 md:h-48 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Card de Sucesso */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8">
          {/* Ícone de Sucesso */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
            Parabéns! Você tem valores a receber!
          </h1>

          {/* Valor Disponível - DESTAQUE */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 mb-8 text-center shadow-lg">
            <p className="text-white text-lg mb-2">Valor Total Disponível:</p>
            <p className="text-white text-5xl sm:text-6xl font-bold">
              R$ {valorDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Dados do Beneficiário */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Dados do Beneficiário
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-700">Nome:</span>
                <span className="text-gray-900">{pessoa?.nome || 'Não informado'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-700">CPF:</span>
                <span className="text-gray-900">{pessoa?.cpf || 'Não informado'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-700">Data de Nascimento:</span>
                <span className="text-gray-900">
                  {pessoa?.data_nascimento ? formatarDataNascimento(pessoa.data_nascimento) : 'Não informado'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2">
                <span className="font-semibold text-gray-700">Sexo:</span>
                <span className="text-gray-900">{pessoa?.sexo === 'M' ? 'Masculino' : pessoa?.sexo === 'F' ? 'Feminino' : 'Não informado'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-semibold text-gray-700">Nome da Mãe:</span>
                <span className="text-gray-900">{pessoa?.nome_mae || 'Não informado'}</span>
              </div>
            </div>
          </div>

          {/* Como Resgatar */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Como resgatar seus valores
            </h2>
            <p className="text-gray-700 text-lg text-center mb-6">
              Clique em "Receba Agora"
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRecebaAgora}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Receba Agora
            </button>
            <button
              onClick={handleNovaConsulta}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Nova Consulta
            </button>
          </div>

          {/* Aviso Importante */}
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Mantenha seus dados atualizados e guarde o número do protocolo desta consulta para futuras referências.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-600 text-sm">
          <p>🔒 Seus dados estão seguros e protegidos</p>
        </div>
      </main>
    </div>
  )
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando resultados...</p>
        </div>
      </div>
    }>
      <ResultadoContent />
    </Suspense>
  )
}
