export const TOS = () => {
  return (
    <div>
      <h1>Termini del servizio</h1>
      <p>Indicare qui i termini del servizio</p>
      <i>In alternativa, ridirezionare su pagina esterna</i>
      <button onClick={() => window.close()}>Chiudi</button>
    </div>
  );
};

export const Privacy = () => {
  return (
    <div>
      <h1>Privacy</h1>
      <p>Indicare qui le policy di privacy</p>
      <i>In alternativa, ridirezionare su pagina esterna</i>
      <button onClick={() => window.close()}>Chiudi</button>
    </div>
  );
};
