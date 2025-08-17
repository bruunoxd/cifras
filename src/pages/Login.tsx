import Auth from "../components/Auth";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-pattern"></div>
      </div>
      <div className="login-container">
        <div className="login-header">
          <div className="app-logo">
            <span className="logo-icon">🎵</span>
            <h1 className="app-name">CifrasNew</h1>
          </div>
          <p className="login-subtitle">
            Sua biblioteca de cifras na palma da mão
          </p>
        </div>
        <Auth />
      </div>
    </div>
  );
}
