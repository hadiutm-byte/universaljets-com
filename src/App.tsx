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
import CrmResourcesPage from "./pages/crm/ResourcesPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import CookiesPage from "./pages/CookiesPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import MemberProfilePage from "./pages/MemberProfilePage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import CrmLayout from "./components/crm/CrmLayout.tsx";
import CrmDashboard from "./pages/crm/CrmDashboard.tsx";
import PipelinePage from "./pages/crm/PipelinePage.tsx";
import ClientsPage from "./pages/crm/ClientsPage.tsx";
import LeadsPage from "./pages/crm/LeadsPage.tsx";
import RequestsPage from "./pages/crm/RequestsPage.tsx";
import QuotesPage from "./pages/crm/QuotesPage.tsx";
import ContractsPage from "./pages/crm/ContractsPage.tsx";
import InvoicesPage from "./pages/crm/InvoicesPage.tsx";
import TripsPage from "./pages/crm/TripsPage.tsx";
import OutreachPage from "./pages/crm/OutreachPage.tsx";
import AdminUsersPage from "./pages/crm/AdminUsersPage.tsx";
import AdminSettingsPage from "./pages/crm/AdminSettingsPage.tsx";
import MembershipPipelinePage from "./pages/crm/MembershipPipelinePage.tsx";
import ReferralsPage from "./pages/crm/ReferralsPage.tsx";
import AccountMgmtPage from "./pages/crm/AccountMgmtPage.tsx";
import HRPage from "./pages/crm/HRPage.tsx";
import ActivityLogPage from "./pages/crm/ActivityLogPage.tsx";
import FinanceDashboardPage from "./pages/crm/FinanceDashboardPage.tsx";
import ReceivablesPage from "./pages/crm/ReceivablesPage.tsx";
import PayablesPage from "./pages/crm/PayablesPage.tsx";
import PaymentsPage from "./pages/crm/PaymentsPage.tsx";
import CreditsPage from "./pages/crm/CreditsPage.tsx";
import BankReconciliationPage from "./pages/crm/BankReconciliationPage.tsx";
import FinancialStatementsPage from "./pages/crm/FinancialStatementsPage.tsx";
import ClientFinanceHistoryPage from "./pages/crm/ClientFinanceHistoryPage.tsx";
import SupplierHistoryPage from "./pages/crm/SupplierHistoryPage.tsx";
import AccountMgmtDetailPage from "./pages/crm/AccountMgmtDetailPage.tsx";
import BDDashboardPage from "./pages/crm/BDDashboardPage.tsx";
import BDDetailPage from "./pages/crm/BDDetailPage.tsx";
import CareersPage from "./pages/CareersPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import CharterPage from "./pages/CharterPage.tsx";
import AircraftGuidePage from "./pages/AircraftGuidePage.tsx";
import RequestFlightPage from "./pages/RequestFlightPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import UnsubscribePage from "./pages/UnsubscribePage.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Ricky3D from "./components/Ricky3D.tsx";
import CookieConsent from "./components/CookieConsent.tsx";
import ContentProtection from "./components/ContentProtection.tsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.tsx";

const queryClient = new QueryClient();

const CRM_ROLES = ["admin", "sales", "operations", "finance", "account_management", "hr", "business_development"] as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ContentProtection />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/jet-card" element={<JetCardPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MemberProfilePage /></ProtectedRoute>} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/request-flight" element={<RequestFlightPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/acmi-leasing" element={<ACMILeasingPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/partners" element={<PartnerPage />} />
          <Route path="/resources" element={<ProtectedRoute allowedRoles={[...CRM_ROLES]}><CrmResourcesPage /></ProtectedRoute>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/crm" element={<ProtectedRoute allowedRoles={[...CRM_ROLES]}><CrmLayout /></ProtectedRoute>}>
            <Route index element={<CrmDashboard />} />
            <Route path="pipeline" element={<PipelinePage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="outreach" element={<OutreachPage />} />
            <Route path="membership" element={<MembershipPipelinePage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="account-mgmt" element={<AccountMgmtPage />} />
            <Route path="account-mgmt/:clientId" element={<AccountMgmtDetailPage />} />
            <Route path="hr" element={<HRPage />} />
            <Route path="bd" element={<BDDashboardPage />} />
            <Route path="bd/:oppId" element={<BDDetailPage />} />
            <Route path="activity" element={<ActivityLogPage />} />
            <Route path="finance" element={<FinanceDashboardPage />} />
            <Route path="finance/receivables" element={<ReceivablesPage />} />
            <Route path="finance/payables" element={<PayablesPage />} />
            <Route path="finance/payments" element={<PaymentsPage />} />
            <Route path="finance/credits" element={<CreditsPage />} />
            <Route path="finance/bank" element={<BankReconciliationPage />} />
            <Route path="finance/statements" element={<FinancialStatementsPage />} />
            <Route path="finance/client-history" element={<ClientFinanceHistoryPage />} />
            <Route path="finance/supplier-history" element={<SupplierHistoryPage />} />
            <Route path="resources" element={<CrmResourcesPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/settings" element={<AdminSettingsPage />} />
          </Route>
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/charter/:slug" element={<CharterPage />} />
          <Route path="/aircraft" element={<AircraftGuidePage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
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
