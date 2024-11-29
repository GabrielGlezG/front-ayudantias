const Spinner = ({ size = "md" }) => (
    <div
      className={`spinner-border spinner-border-${size}`}
      style={{ width: size === "sm" ? "1rem" : "2rem", height: size === "sm" ? "1rem" : "2rem" }}
      role="status"
    >
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
  
  export default Spinner;
  