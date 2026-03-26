import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import Index from "./pages/Index.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import CookieConsent from "./components/CookieConsent.tsx";
import ContentProtection from "./components/ContentProtection.tsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.tsx";

// Lazy-loaded routes for code splitting
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const MembersPage = lazy(() => import("./pages/MembersPage.tsx"));
const JetCardPage = lazy(() => import("./pages/JetCardPage.tsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.tsx"));
const ACMILeasingPage = lazy(() => import("./pages/ACMILeasingPage.tsx"));
const PartnerPage = lazy(() => import("./pages/PartnerPage.tsx"));
const DestinationsPage = lazy(() => import("./pages/DestinationsPage.tsx"));
const DestinationDetailPage = lazy(() => import("./pages/DestinationDetailPage.tsx"));
const CrmResourcesPage = lazy(() => import("./pages/crm/ResourcesPage.tsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.tsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.tsx"));
const CookiesPage = lazy(() => import("./pages/CookiesPage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.tsx"));
const MemberProfilePage = lazy(() => import("./pages/MemberProfilePage.tsx"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute.tsx"));
const CrmLayout = lazy(() => import("./components/crm/CrmLayout.tsx"));
const CrmDashboard = lazy(() => import("./pages/crm/CrmDashboard.tsx"));
const PipelinePage = lazy(() => import("./pages/crm/PipelinePage.tsx"));
const ClientsPage = lazy(() => import("./pages/crm/ClientsPage.tsx"));
const LeadsPage = lazy(() => import("./pages/crm/LeadsPage.tsx"));
const RequestsPage = lazy(() => import("./pages/crm/RequestsPage.tsx"));
const QuotesPage = lazy(() => import("./pages/crm/QuotesPage.tsx"));
const ContractsPage = lazy(() => import("./pages/crm/ContractsPage.tsx"));
const InvoicesPage = lazy(() => import("./pages/crm/InvoicesPage.tsx"));
const TripsPage = lazy(() => import("./pages/crm/TripsPage.tsx"));
const OutreachPage = lazy(() => import("./pages/crm/OutreachPage.tsx"));
const AdminUsersPage = lazy(() => import("./pages/crm/AdminUsersPage.tsx"));
const AdminSettingsPage = lazy(() => import("./pages/crm/AdminSettingsPage.tsx"));
const MembershipPipelinePage = lazy(() => import("./pages/crm/MembershipPipelinePage.tsx"));
const ReferralsPage = lazy(() => import("./pages/crm/ReferralsPage.tsx"));
const AccountMgmtPage = lazy(() => import("./pages/crm/AccountMgmtPage.tsx"));
const HRPage = lazy(() => import("./pages/crm/HRPage.tsx"));
const ActivityLogPage = lazy(() => import("./pages/crm/ActivityLogPage.tsx"));
const FinanceDashboardPage = lazy(() => import("./pages/crm/FinanceDashboardPage.tsx"));
const ReceivablesPage = lazy(() => import("./pages/crm/ReceivablesPage.tsx"));
const PayablesPage = lazy(() => import("./pages/crm/PayablesPage.tsx"));
const PaymentsPage = lazy(() => import("./pages/crm/PaymentsPage.tsx"));
const CreditsPage = lazy(() => import("./pages/crm/CreditsPage.tsx"));
const BankReconciliationPage = lazy(() => import("./pages/crm/BankReconciliationPage.tsx"));
const FinancialStatementsPage = lazy(() => import("./pages/crm/FinancialStatementsPage.tsx"));
const ClientFinanceHistoryPage = lazy(() => import("./pages/crm/ClientFinanceHistoryPage.tsx"));
const SupplierHistoryPage = lazy(() => import("./pages/crm/SupplierHistoryPage.tsx"));
const AccountMgmtDetailPage = lazy(() => import("./pages/crm/AccountMgmtDetailPage.tsx"));
const BDDashboardPage = lazy(() => import("./pages/crm/BDDashboardPage.tsx"));
const BDDetailPage = lazy(() => import("./pages/crm/BDDetailPage.tsx"));
const CareersPage = lazy(() => import("./pages/CareersPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const ConciergePage = lazy(() => import("./pages/ConciergePage.tsx"));
const CharterPage = lazy(() => import("./pages/CharterPage.tsx"));
const AircraftGuidePage = lazy(() => import("./pages/AircraftGuidePage.tsx"));
const FleetPage = lazy(() => import("./pages/FleetPage.tsx"));
const FleetDetailPage = lazy(() => import("./pages/FleetDetailPage.tsx"));
const RequestFlightPage = lazy(() => import("./pages/RequestFlightPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage.tsx"));
const Ricky3D = lazy(() => import("./components/Ricky3D.tsx"));

const queryClient = new QueryClient();

const CRM_ROLES = ["admin", "sales", "operations", "finance", "account_management", "hr", "business_development"] as const;

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ContentProtection />
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
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
            <Route path="/concierge" element={<ConciergePage />} />
            <Route path="/aircraft" element={<AircraftGuidePage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/fleet/:slug" element={<FleetDetailPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Suspense fallback={null}>
          <Ricky3D />
        </Suspense>
        <FloatingWhatsApp />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
