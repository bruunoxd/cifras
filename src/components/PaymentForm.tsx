import { useState } from "react";
import { loadPrefs, savePrefs } from "../store/prefs";
import "./PaymentForm.css";

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

export default function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<PaymentData>>({});
  const [processing, setProcessing] = useState(false);

  // Formatar número do cartão
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Formatar data de expiração
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentData> = {};

    // Validar número do cartão
    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    if (!cardNumber) {
      newErrors.cardNumber = "Número do cartão é obrigatório";
    } else if (cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = "Número do cartão inválido";
    }

    // Validar nome
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Nome é obrigatório";
    } else if (formData.cardName.trim().length < 3) {
      newErrors.cardName = "Nome muito curto";
    }

    // Validar data de expiração
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Data de expiração é obrigatória";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (
        !month ||
        !year ||
        parseInt(month) < 1 ||
        parseInt(month) > 12 ||
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Data de expiração inválida";
      }
    }

    // Validar CVV
    if (!formData.cvv) {
      newErrors.cvv = "CVV é obrigatório";
    } else if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = "CVV inválido";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Detectar bandeira do cartão
  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5") || number.startsWith("2")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    if (number.startsWith("6")) return "discover";
    return "unknown";
  };

  // Processar pagamento
  const processPayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);

    try {
      // Simular processamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Cartões de teste que sempre passam
      const testCards = [
        "4111111111111111",
        "5555555555554444",
        "3782822463100005",
      ];
      const cardNumber = formData.cardNumber.replace(/\s/g, "");

      // Simular sucesso/falha (cartões de teste sempre passam, outros 80% de sucesso)
      const success = testCards.includes(cardNumber) || Math.random() > 0.2;

      if (success) {
        // Ativar assinatura premium
        const prefs = loadPrefs();
        prefs.subscribed = true;
        prefs.subscriptionDate = new Date().toISOString();
        prefs.paymentMethod = {
          cardBrand: getCardBrand(formData.cardNumber),
          lastFour: formData.cardNumber.slice(-4),
          email: formData.email,
        };
        savePrefs(prefs);

        // Aguardar um pouco para mostrar o sucesso
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onSuccess();
      } else {
        throw new Error("Pagamento recusado. Verifique os dados do cartão.");
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Erro no processamento do pagamento"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiryDate") {
      formattedValue = formatExpiryDate(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4);
    } else if (field === "cardName") {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    }

    setFormData({ ...formData, [field]: formattedValue });

    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const cardBrand = getCardBrand(formData.cardNumber);

  return (
    <div className="payment-overlay">
      <div className="payment-container">
        <div className="payment-header">
          <h2>Finalizar Assinatura Premium</h2>
          <button
            className="close-btn"
            onClick={onCancel}
            disabled={processing}
          >
            ×
          </button>
        </div>

        <div className="payment-content">
          <div className="payment-summary">
            <h3>Resumo do Pedido</h3>
            <div className="order-item">
              <span>Cifras Premium - Mensal</span>
              <span>R$ 9,90</span>
            </div>
            <div className="order-discount">
              <span>Desconto (50% OFF)</span>
              <span>-R$ 9,90</span>
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>R$ 9,90</span>
            </div>
          </div>

          <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-section">
              <h4>Dados do Cartão</h4>

              <div className="form-group">
                <label htmlFor="cardNumber">Número do Cartão</label>
                <div className="card-input-wrapper">
                  <input
                    id="cardNumber"
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={errors.cardNumber ? "error" : ""}
                    disabled={processing}
                  />
                  {cardBrand !== "unknown" && (
                    <div className={`card-brand ${cardBrand}`}>
                      {cardBrand === "visa" && "VISA"}
                      {cardBrand === "mastercard" && "MC"}
                      {cardBrand === "amex" && "AMEX"}
                      {cardBrand === "discover" && "DISC"}
                    </div>
                  )}
                </div>
                {errors.cardNumber && (
                  <span className="error-message">{errors.cardNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cardName">Nome no Cartão</label>
                <input
                  id="cardName"
                  type="text"
                  value={formData.cardName}
                  onChange={(e) =>
                    handleInputChange("cardName", e.target.value)
                  }
                  placeholder="NOME COMO NO CARTÃO"
                  className={errors.cardName ? "error" : ""}
                  disabled={processing}
                />
                {errors.cardName && (
                  <span className="error-message">{errors.cardName}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Validade</label>
                  <input
                    id="expiryDate"
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    placeholder="MM/AA"
                    maxLength={5}
                    className={errors.expiryDate ? "error" : ""}
                    disabled={processing}
                  />
                  {errors.expiryDate && (
                    <span className="error-message">{errors.expiryDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={errors.cvv ? "error" : ""}
                    disabled={processing}
                  />
                  {errors.cvv && (
                    <span className="error-message">{errors.cvv}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email para Confirmação</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className={errors.email ? "error" : ""}
                  disabled={processing}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="security-info">
              <span className="security-icon">🔒</span>
              <p>
                Seus dados estão protegidos com criptografia SSL de 256 bits
              </p>
            </div>

            <div className="test-cards-info">
              <h5>Cartões de teste (para demonstração):</h5>
              <div className="test-cards">
                <div className="test-card">
                  <strong>Visa:</strong> 4111 1111 1111 1111
                </div>
                <div className="test-card">
                  <strong>Mastercard:</strong> 5555 5555 5555 4444
                </div>
                <div className="test-card">
                  <strong>Amex:</strong> 3782 822463 10005
                </div>
              </div>
              <small>Use qualquer data futura e CVV de 3-4 dígitos</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={processing}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={processPayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner"></span>
                    Processando...
                  </>
                ) : (
                  <>
                    <span className="icon">💳</span>
                    Finalizar Pagamento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
