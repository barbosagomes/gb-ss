import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function Support() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12 px-6 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Centro de Suporte</h1>
        <p className="text-slate-600 mb-12">Estamos aqui para ajudar você a escalar suas vendas no TikTok Shop.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <Mail className="w-10 h-10 text-pink-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">E-mail</h3>
            <p className="text-sm text-slate-600 mb-4">Resposta em até 24h úteis.</p>
            <Button variant="outline" className="w-full">Enviar E-mail</Button>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <MessageCircle className="w-10 h-10 text-pink-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Chat Vivo</h3>
            <p className="text-sm text-slate-600 mb-4">Segunda a Sexta, 9h às 18h.</p>
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">Iniciar Chat</Button>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <HelpCircle className="w-10 h-10 text-pink-600 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">Base de Conhecimento</h3>
            <p className="text-sm text-slate-600 mb-4">Tutoriais e FAQs.</p>
            <Button variant="outline" className="w-full">Ver Tutoriais</Button>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 pt-8 border-t border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <details className="p-4 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-50">
              <summary className="font-medium text-slate-900">Como conectar minha loja do TikTok?</summary>
              <p className="mt-2 text-sm">Vá em Configurações &gt; Conexões e clique em 'Conectar TikTok Shop'. Você será redirecionado para a autorização oficial.</p>
            </details>
            <details className="p-4 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-50">
              <summary className="font-medium text-slate-900">Com que frequência o estoque é sincronizado?</summary>
              <p className="mt-2 text-sm">A sincronização ocorre em tempo real sempre que houver uma alteração detectada em seu inventário principal.</p>
            </details>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
