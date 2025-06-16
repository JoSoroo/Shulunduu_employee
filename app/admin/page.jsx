import PageContainer from "../admin/(DashboardLayout)/components/container/PageContainer";
import { AuthProvider } from "./context/authContext";
import Login from "./(DashboardLayout)/components/login/Login";
 export default function Home() {
  return (
    <PageContainer title="Шөлөндө ажилчин бүртгэл" description="Shulundu employees">
       <AuthProvider><Login/></AuthProvider>
       
    </PageContainer>     
  );
}