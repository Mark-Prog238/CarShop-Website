import { useState } from "react";
import { CustomInput } from "./components/CustumInput";
function App() {
  const [email, setEmail] = useState("");
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <h1>Hezz</h1>

      <form action="login">
        <CustomInput
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={setEmail}
          label="TEXTTTTTTTTTTTT"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;
