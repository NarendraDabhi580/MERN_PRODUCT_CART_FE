import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        onClick={() => {
          alert("Your order will be placed");
          navigate("/");
        }}
        className="btn btn-primary btn-small"
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;
