import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function GoogleSignIn() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        await axios.post("https://localhost:7146/auth/google", {
          token: credentialResponse.credential
        });

        alert("Login successful");
      }}
      onError={() => {
        alert("Google login failed");
      }}
    />
  );
}
