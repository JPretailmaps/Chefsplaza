function GEOLayout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: `radial-gradient(ellipse at top, #e66465, transparent),
            radial-gradient(ellipse at bottom, #4d9f0c, transparent)`
    }}
    >
      <h1 style={{ fontSize: '30px' }}>We&apos;ve sorry.</h1>
      <h3 style={{ fontSize: '27px' }}>Website is not allowed in your country</h3>
    </div>
  );
}

export default GEOLayout;
