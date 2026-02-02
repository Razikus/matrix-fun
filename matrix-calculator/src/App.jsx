import React, { useState } from 'react';

// Utility functions for matrix operations
const createEmptyMatrix = (rows, cols) => 
  Array(rows).fill(null).map(() => Array(cols).fill(0));

const copyMatrix = (matrix) => matrix.map(row => [...row]);

// Calculate determinant using cofactor expansion
const determinant = (matrix) => {
  const n = matrix.length;
  if (n !== matrix[0].length) return null;
  
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  
  let det = 0;
  for (let j = 0; j < n; j++) {
    det += Math.pow(-1, j) * matrix[0][j] * determinant(
      matrix.slice(1).map(row => [...row.slice(0, j), ...row.slice(j + 1)])
    );
  }
  return det;
};

const adjugate = (matrix) => {
  const n = matrix.length;
  if (n === 1) return [[1]];
  
  const cofactors = createEmptyMatrix(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = matrix
        .filter((_, row) => row !== i)
        .map(row => row.filter((_, col) => col !== j));
      cofactors[i][j] = Math.pow(-1, i + j) * determinant(minor);
    }
  }
  return transpose(cofactors);
};

const inverse = (matrix) => {
  const n = matrix.length;
  if (n !== matrix[0].length) return null;
  
  const det = determinant(matrix);
  if (det === 0) return null; 
  
  const adj = adjugate(matrix);
  return adj.map(row => row.map(val => val / det));
};

// Transpose matrix
const transpose = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = createEmptyMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
};

// Rotate 90° clockwise
const rotateRight = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = createEmptyMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][rows - 1 - i] = matrix[i][j];
    }
  }
  return result;
};

// Add matrices
const addMatrices = (a, b) => {
  if (a.length !== b.length || a[0].length !== b[0].length) return null;
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
};

// Multiply matrices
const multiplyMatrices = (a, b) => {
  if (a[0].length !== b.length) return null;
  const result = createEmptyMatrix(a.length, b[0].length);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  wrapper: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1rem',
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  tab: {
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#3b82f6',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  tabInactive: {
    background: 'white',
    color: '#475569',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '24px',
  },
  matrixSection: {
    marginBottom: '24px',
  },
  matrixHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '16px',
  },
  matrixTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '12px',
  },
  sizeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  sizeLabel: {
    color: '#6b7280',
  },
  sizeInput: {
    width: '50px',
    padding: '6px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '14px',
  },
  sizeX: {
    color: '#9ca3af',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    background: '#3b82f6',
    color: 'white',
  },
  buttonSecondary: {
    background: '#e5e7eb',
    color: '#374151',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  matrixContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  matrixWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  matrixLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '8px',
  },
  matrixBrackets: {
    position: 'relative',
    padding: '8px 16px',
  },
  leftBracket: {
    position: 'absolute',
    left: '0',
    top: '0',
    bottom: '0',
    width: '8px',
    borderLeft: '2px solid #9ca3af',
    borderTop: '2px solid #9ca3af',
    borderBottom: '2px solid #9ca3af',
    borderRadius: '4px 0 0 4px',
  },
  rightBracket: {
    position: 'absolute',
    right: '0',
    top: '0',
    bottom: '0',
    width: '8px',
    borderRight: '2px solid #9ca3af',
    borderTop: '2px solid #9ca3af',
    borderBottom: '2px solid #9ca3af',
    borderRadius: '0 4px 4px 0',
  },
  matrixGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  matrixRow: {
    display: 'flex',
    gap: '4px',
  },
  cell: {
    width: '56px',
    height: '40px',
    textAlign: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  cellEditable: {
    background: 'white',
  },
  cellReadonly: {
    background: '#f3f4f6',
    color: '#6b7280',
  },
  matrixSize: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  divider: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '24px',
  },
  actionButton: {
    display: 'flex',
    justifyContent: 'center',
    margin: '24px 0',
  },
  warning: {
    textAlign: 'center',
    color: '#d97706',
    fontSize: '14px',
    marginBottom: '16px',
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    textAlign: 'center',
    color: '#dc2626',
  },
  result: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '24px',
  },
  resultTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#166534',
    textAlign: 'center',
    marginBottom: '16px',
  },
  resultNumber: {
    textAlign: 'center',
  },
  resultValue: {
    fontSize: '2.5rem',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#15803d',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#9ca3af',
    fontSize: '14px',
  },
};

// Matrix Cell Component
const MatrixCell = ({ value, onChange, readOnly }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    readOnly={readOnly}
    style={{
      ...styles.cell,
      ...(readOnly ? styles.cellReadonly : styles.cellEditable),
    }}
  />
);

// Matrix Grid Component
const MatrixGrid = ({ matrix, onChange, label, readOnly = false }) => (
  <div style={styles.matrixWrapper}>
    <span style={styles.matrixLabel}>{label}</span>
    <div style={styles.matrixBrackets}>
      <div style={styles.leftBracket} />
      <div style={styles.rightBracket} />
      <div style={styles.matrixGrid}>
        {matrix.map((row, i) => (
          <div key={i} style={styles.matrixRow}>
            {row.map((val, j) => (
              <MatrixCell
                key={`${i}-${j}`}
                value={val}
                onChange={(newVal) => {
                  const newMatrix = copyMatrix(matrix);
                  newMatrix[i][j] = newVal;
                  onChange(newMatrix);
                }}
                readOnly={readOnly}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
    <span style={styles.matrixSize}>
      {matrix.length}×{matrix[0].length}
    </span>
  </div>
);

// Size Control Component
const SizeControl = ({ rows, cols, onRowsChange, onColsChange, label }) => (
  <div style={styles.sizeControl}>
    <span style={styles.sizeLabel}>{label}:</span>
    <input
      type="number"
      min="1"
      max="99"
      value={rows}
      onChange={(e) => {
        const val = parseInt(e.target.value) || 1;
        onRowsChange(Math.max(1, Math.min(99, val)));
      }}
      style={styles.sizeInput}
    />
    <span style={styles.sizeX}>×</span>
    <input
      type="number"
      min="1"
      max="99"
      value={cols}
      onChange={(e) => {
        const val = parseInt(e.target.value) || 1;
        onColsChange(Math.max(1, Math.min(99, val)));
      }}
      style={styles.sizeInput}
    />
  </div>
);

// Button Component
const Button = ({ onClick, children, variant = 'primary', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      ...styles.button,
      ...(variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary),
      ...(disabled ? styles.buttonDisabled : {}),
    }}
  >
    {children}
  </button>
);

// Main App
export default function MatrixCalculator() {
  const [activeTab, setActiveTab] = useState('determinant');
  
  const [matrixA, setMatrixA] = useState([[1, 2], [3, 4]]);
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  
  const [matrixB, setMatrixB] = useState([[5, 6], [7, 8]]);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  
  const [result, setResult] = useState(null);
  const [resultLabel, setResultLabel] = useState('');
  const [error, setError] = useState('');

  const resizeMatrix = (matrix, newRows, newCols) => {
    const result = createEmptyMatrix(newRows, newCols);
    for (let i = 0; i < Math.min(matrix.length, newRows); i++) {
      for (let j = 0; j < Math.min(matrix[0].length, newCols); j++) {
        result[i][j] = matrix[i][j];
      }
    }
    return result;
  };

  const handleResizeA = (newRows, newCols) => {
    setRowsA(newRows);
    setColsA(newCols);
    setMatrixA(resizeMatrix(matrixA, newRows, newCols));
    setResult(null);
  };

  const handleResizeB = (newRows, newCols) => {
    setRowsB(newRows);
    setColsB(newCols);
    setMatrixB(resizeMatrix(matrixB, newRows, newCols));
    setResult(null);
  };

  const fillRandom = (setMatrix, rows, cols) => {
    const newMatrix = createEmptyMatrix(rows, cols).map(row => 
      row.map(() => Math.floor(Math.random() * 19) - 9)
    );
    setMatrix(newMatrix);
    setResult(null);
  };

  const clearMatrix = (setMatrix, rows, cols) => {
    setMatrix(createEmptyMatrix(rows, cols));
    setResult(null);
  };

  const calcDeterminant = () => {
    setError('');
    if (matrixA.length !== matrixA[0].length) {
      setError('Macierz musi być kwadratowa!');
      setResult(null);
      return;
    }
    const det = determinant(matrixA);
    setResult(det);
    setResultLabel('Wyznacznik');
  };

  const calcTranspose = () => {
    setError('');
    setResult(transpose(matrixA));
    setResultLabel('Transpozycja (Aᵀ)');
  };

  const calcRotate = () => {
    setError('');
    setResult(rotateRight(matrixA));
    setResultLabel('Obrót o 90° w prawo');
  };

  const calcAdd = () => {
    setError('');
    const sum = addMatrices(matrixA, matrixB);
    if (!sum) {
      setError('Macierze muszą mieć te same wymiary!');
      setResult(null);
      return;
    }
    setResult(sum);
    setResultLabel('A + B');
  };

  const calcMultiply = () => {
    setError('');
    const product = multiplyMatrices(matrixA, matrixB);
    if (!product) {
      setError(`Liczba kolumn A (${matrixA[0].length}) musi być równa liczbie wierszy B (${matrixB.length})!`);
      setResult(null);
      return;
    }
    setResult(product);
    setResultLabel('A × B');
  };

  const tabs = [
    { id: 'determinant', label: 'Wyznacznik', icon: '|A|' },
    { id: 'inverse', label: 'Odwrotna', icon: 'A⁻¹' },
    { id: 'transpose', label: 'Transpozycja', icon: 'Aᵀ' },
    { id: 'add', label: 'Dodawanie', icon: '+' },
    { id: 'multiply', label: 'Mnożenie', icon: '×' },
  ];

  const calcInverse = () => {
    setError('');
    if (matrixA.length !== matrixA[0].length) {
      setError('Macierz musi być kwadratowa');
      setResult(null);
      return;
    }
    const det = determinant(matrixA);
    if (det === 0) {
      setError('Macierz jest osobliwa (det = 0) - nie ma odwrotności');
      setResult(null);
      return;
    }
    const inv = inverse(matrixA);
    setResult(inv);
    setResultLabel('Macierz odwrotna (A⁻¹)');
  };

  const needsSecondMatrix = ['add', 'multiply'].includes(activeTab);

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>🧮 Kalkulator Macierzy</h1>
          <p style={styles.subtitle}>Operacje na macierzach</p>
        </div>

        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setError(''); }}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive),
              }}
            >
              <span style={{ fontFamily: 'monospace' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.matrixSection}>
            <div style={styles.matrixHeader}>
              <h2 style={styles.matrixTitle}>Macierz A</h2>
              <div style={styles.controls}>
                <SizeControl
                  rows={rowsA}
                  cols={colsA}
                  onRowsChange={(r) => handleResizeA(r, colsA)}
                  onColsChange={(c) => handleResizeA(rowsA, c)}
                  label="Rozmiar"
                />
                <Button variant="secondary" onClick={() => fillRandom(setMatrixA, rowsA, colsA)}>
                  Losuj
                </Button>
                <Button variant="secondary" onClick={() => clearMatrix(setMatrixA, rowsA, colsA)}>
                  Wyczyść
                </Button>
              </div>
            </div>
            <div style={styles.matrixContainer}>
              <MatrixGrid matrix={matrixA} onChange={setMatrixA} label="A" />
            </div>
          </div>

          {needsSecondMatrix && (
            <div style={{ ...styles.matrixSection, ...styles.divider }}>
              <div style={styles.matrixHeader}>
                <h2 style={styles.matrixTitle}>Macierz B</h2>
                <div style={styles.controls}>
                  <SizeControl
                    rows={rowsB}
                    cols={colsB}
                    onRowsChange={(r) => handleResizeB(r, colsB)}
                    onColsChange={(c) => handleResizeB(rowsB, c)}
                    label="Rozmiar"
                  />
                  <Button variant="secondary" onClick={() => fillRandom(setMatrixB, rowsB, colsB)}>
                    Losuj
                  </Button>
                  <Button variant="secondary" onClick={() => clearMatrix(setMatrixB, rowsB, colsB)}>
                    Wyczyść
                  </Button>
                </div>
              </div>
              <div style={styles.matrixContainer}>
                <MatrixGrid matrix={matrixB} onChange={setMatrixB} label="B" />
              </div>
            </div>
          )}

          <div style={styles.actionButton}>
            {activeTab === 'determinant' && (
              <Button onClick={calcDeterminant} disabled={rowsA !== colsA}>
                Oblicz wyznacznik
              </Button>
            )}
            {activeTab === 'inverse' && (
              <Button onClick={calcInverse} disabled={rowsA !== colsA}>
                Oblicz macierz odwrotną
              </Button>
            )}
            {activeTab === 'transpose' && (
              <Button onClick={calcTranspose}>Transponuj macierz</Button>
            )}
            {activeTab === 'rotate' && (
              <Button onClick={calcRotate}>Obróć o 90° w prawo</Button>
            )}
            {activeTab === 'add' && (
              <Button onClick={calcAdd} disabled={rowsA !== rowsB || colsA !== colsB}>
                Dodaj macierze
              </Button>
            )}
            {activeTab === 'multiply' && (
              <Button onClick={calcMultiply} disabled={colsA !== rowsB}>
                Pomnóż macierze
              </Button>
            )}
          </div>

          {activeTab === 'inverse' && rowsA !== colsA && (
            <p style={styles.warning}>
              ⚠️ Macierz odwrotną można obliczyć tylko dla macierzy kwadratowej
            </p>
          )}

          {activeTab === 'determinant' && rowsA !== colsA && (
            <p style={styles.warning}>
              ⚠️ Wyznacznik można obliczyć tylko dla macierzy kwadratowej
            </p>
          )}
          {activeTab === 'add' && (rowsA !== rowsB || colsA !== colsB) && (
            <p style={styles.warning}>
              ⚠️ Macierze muszą mieć te same wymiary ({rowsA}×{colsA} ≠ {rowsB}×{colsB})
            </p>
          )}
          {activeTab === 'multiply' && colsA !== rowsB && (
            <p style={styles.warning}>
              ⚠️ Liczba kolumn A ({colsA}) musi być równa liczbie wierszy B ({rowsB})
            </p>
          )}

          {error && <div style={styles.error}>{error}</div>}

          {result !== null && (
            <div style={styles.result}>
              <h3 style={styles.resultTitle}>{resultLabel}</h3>
              {typeof result === 'number' ? (
                <div style={styles.resultNumber}>
                  <span style={styles.resultValue}>
                    {Number.isInteger(result) ? result : result.toFixed(4)}
                  </span>
                </div>
              ) : (
                <div style={styles.matrixContainer}>
                  <MatrixGrid matrix={result} onChange={() => {}} label="Wynik" readOnly />
                </div>
              )}
            </div>
          )}
        </div>

        <p style={styles.footer}>
          by Adam Raźniewski
        </p>
      </div>
    </div>
  );
}