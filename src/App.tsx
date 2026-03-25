import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import MembersPage from "./pages/MembersPage.tsx";
import JetCardPage from "./pages/JetCardPage.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import ACMILeasingPage from "./pages/ACMILeasingPage.tsx";
import PartnerPage from "./pages/PartnerPage.tsx";
import DestinationsPage from "./pages/DestinationsPage.tsx";
import ResourcesPage from "./pages/ResourcesPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import CookiesPage from "./pages/CookiesPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import CrmLayout from "./components/crm/CrmLayout.tsx";
import CrmDashboard from "./pages/crm/CrmDashboard.tsx";
import ClientsPage from "./pages/crm/ClientsPage.tsx";
import LeadsPage from "./pages/crm/LeadsPage.tsx";
import RequestsPage from "./pages/crm/RequestsPage.tsx";
import QuotesPage from "./pages/crm/QuotesPage.tsx";
import ContractsPage from "./pages/crm/ContractsPage.tsx";
import InvoicesPage from "./pages/crm/InvoicesPage.tsx";
import TripsPage from "./pages/crm/TripsPage.tsx";
import OutreachPage from "./pages/crm/OutreachPage.tsx";
import CareersPage from "./pages/CareersPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import CharterPage from "./pages/CharterPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Ricky3D from "./components/Ricky3D.tsx";
import CookieConsent from "./components/CookieConsent.tsx";
import ContentProtection from "./components/ContentProtection.tsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.tsx";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ContentProtection />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/jet-card" element={<JetCardPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/acmi-leasing" element={<ACMILeasingPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/partners" element={<PartnerPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/crm" element={<ProtectedRoute allowedRoles={["admin", "sales", "operations", "finance", "account_management"]}><CrmLayout /></ProtectedRoute>}>
            <Route index element={<CrmDashboard />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="outreach" element={<OutreachPage />} />
          </Route>
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/charter/:slug" element={<CharterPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Ricky3D />
        <FloatingWhatsApp />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
