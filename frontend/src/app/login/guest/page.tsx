// import Image from "next/image";
// import guestLogo from "../../../../public/guest.png";
import LoginForm from "@/components/ui/LoginForm";

const loginPage = () => {
  return (
    <LoginForm
      formHeading="Guest Login"
      submitUrl="https://localhost:4000/api/auth/login/guest"
      guest={true}
    />
  );
};

export default loginPage;
