export const Box = ({ ficha }) => {
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "1px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      {ficha}
    </div>
  );
};
