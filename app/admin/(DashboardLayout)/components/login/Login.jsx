import PageContainer from "../container/PageContainer";
import AuthLogin from "./AuthLogin";

const Login = () => {
  return (
    <PageContainer
  title="Login"
  description="This is the login page"
  style={{
    backgroundImage: "url('/background.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  }}
>
<div
  className="flex items-center justify-center min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('/background.jpg')" }}
>
  <AuthLogin />
</div>
</PageContainer>

  );
};

export default Login;
