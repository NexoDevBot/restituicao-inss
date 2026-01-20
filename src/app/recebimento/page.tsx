'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function RecebimentoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [valor, setValor] = useState<number>(0)
  const [cpf, setCpf] = useState<string>('')
  const [nome, setNome] = useState<string>('')

  useEffect(() => {
    const valorParam = searchParams.get('valor')
    const cpfParam = searchParams.get('cpf')
    const nomeParam = searchParams.get('nome')

    if (valorParam) setValor(Number(valorParam))
    if (cpfParam) setCpf(cpfParam)
    if (nomeParam) setNome(decodeURIComponent(nomeParam))
  }, [searchParams])

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header com Logo */}
      <header className="bg-white shadow-sm py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <img
            src="https://blog.flaviarita.com/wp-content/uploads/2018/08/logo-INSS-2.png"
            alt="Logo INSS"
            className="h-32 sm:h-40 md:h-48 w-auto cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Finalizar Recebimento
          </h1>
          <p className="text-lg text-gray-600">
            Complete o pagamento das taxas para liberar seu valor
          </p>
        </div>

        {/* Card de Resumo do Valor */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl p-8 sm:p-10 mb-8 text-center">
          <div className="mb-4">
            <span className="text-6xl">💰</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Valor a Receber
          </h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mt-6">
            <p className="text-5xl sm:text-6xl font-bold text-white">
              {formatarValor(valor)}
            </p>
          </div>
        </div>

        {/* Dados do Beneficiário */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">👤</span>
            Beneficiário
          </h3>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-500 mb-1">Nome</p>
              <p className="text-lg font-semibold text-gray-900">{nome}</p>
            </div>
            <div className="pb-4">
              <p className="text-sm text-gray-500 mb-1">CPF</p>
              <p className="text-lg font-semibold text-gray-900">{formatarCPF(cpf)}</p>
            </div>
          </div>
        </div>

        {/* Informações sobre Taxas */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 sm:p-8 mb-8">
          <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center">
            <span className="mr-3">⚠️</span>
            Taxas Administrativas Pendentes
          </h3>
          <p className="text-gray-700 mb-4">
            Para liberar o valor de <strong>{formatarValor(valor)}</strong>, é necessário realizar o pagamento das taxas administrativas obrigatórias.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>Taxa de processamento e análise documental</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>Taxa de liberação bancária</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>Emolumentos legais</span>
            </li>
          </ul>
        </div>

        {/* Área de Integração do Gateway de Pagamento */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">💳</span>
            Pagamento das Taxas
          </h3>
          
          {/* Placeholder para Gateway de Pagamento */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <div className="mb-4">
              <span className="text-6xl">🔒</span>
            </div>
            <h4 className="text-xl font-bold text-gray-700 mb-2">
              Gateway de Pagamento
            </h4>
            <p className="text-gray-600 mb-6">
              Esta área será integrada com o gateway de pagamento para processar as taxas administrativas.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                📋 Informações para Integração:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Valor a receber: {formatarValor(valor)}</li>
                <li>• CPF: {formatarCPF(cpf)}</li>
                <li>• Nome: {nome}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Voltar ao Início
          </button>
          <button
            onClick={() => alert('Gateway de pagamento será integrado aqui')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            💳 Pagar Taxas
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>🔒 Ambiente seguro e criptografado</p>
          <p className="mt-2">Seus dados estão protegidos</p>
        </div>
      </main>
    </div>
  )
}

export default function RecebimentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <RecebimentoContent />
    </Suspense>
  )
}
