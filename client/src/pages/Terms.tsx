import DashboardLayout from "@/components/DashboardLayout";

export default function Terms() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12 px-6 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Termos de Uso</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o GB StockSync, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Nossa plataforma fornece serviços de sincronização de estoque e gerenciamento para vendedores do TikTok Shop.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Uso do Serviço</h2>
            <p>
              Você é responsável por manter a confidencialidade de sua conta e senha. 
              O GB StockSync não se responsabiliza por quaisquer perdas resultantes do uso não autorizado de sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Integração com TikTok Shop</h2>
            <p>
              O uso de nossa ferramenta requer autorização através da API oficial do TikTok Shop. 
              Respeitamos todos os termos e políticas estabelecidos pelo TikTok para desenvolvedores e vendedores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Limitação de Responsabilidade</h2>
            <p>
              O GB StockSync envidará esforços comercialmente razoáveis para garantir a precisão da sincronização, 
              mas não garante que o serviço será ininterrupto ou livre de erros.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <p className="text-sm">Última atualização: 07 de Maio de 2026</p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
