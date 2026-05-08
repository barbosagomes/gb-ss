import DashboardLayout from "@/components/DashboardLayout";

export default function Privacy() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12 px-6 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Coleta de Informações</h2>
            <p>
              Coletamos apenas as informações necessárias para a sincronização de seus produtos e estoque entre seus sistemas e o TikTok Shop. 
              Isso inclui dados de produtos, níveis de estoque e informações básicas de perfil fornecidas via OAuth.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Uso dos Dados</h2>
            <p>
              Seus dados são usados exclusivamente para a finalidade de automação e gerenciamento de estoque solicitada por você. 
              Não vendemos ou compartilhamos seus dados comerciais com terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Segurança</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, 
              alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Seus Direitos</h2>
            <p>
              Você pode solicitar a exclusão de seus dados e a revogação do acesso à sua conta do TikTok Shop a qualquer momento 
              através das configurações da plataforma.
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
