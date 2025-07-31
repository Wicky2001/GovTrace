import LoginForm from "@/components/ui/LoginForm";

const AdminLoginPage = () => {
  return (
    <LoginForm
      formHeading="Admin Login"
      submitUrl="https://localhost:4000/api/auth/login/admin"
      guest={false}
    />
  );
};

export default AdminLoginPage;
