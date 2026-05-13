/**
 * Fresnel integrals C(t) and S(t) used for Euler spiral (clothoid) evaluation.
 * Uses Taylor series expansion for small t and rational approximation for large t.
 */

/**
 * Compute Fresnel integrals S(t) and C(t) where:
 *   C(t) = ∫₀ᵗ cos(π/2 · u²) du
 *   S(t) = ∫₀ᵗ sin(π/2 · u²) du
 */
export function fresnelIntegral(t: number): { c: number; s: number } {
  const sign = t < 0 ? -1 : 1;
  const x = Math.abs(t);

  if (x < 1e-10) {
    return { c: 0, s: 0 };
  }

  let c: number;
  let s: number;

  if (x <= 1.6) {
    // Taylor series expansion — accurate for small x
    c = taylorC(x);
    s = taylorS(x);
  } else {
    // Rational approximation for larger x
    const result = rationalApprox(x);
    c = result.c;
    s = result.s;
  }

  return { c: sign * c, s: sign * s };
}

function taylorC(x: number): number {
  const piHalf = Math.PI / 2;
  const x2 = x * x * piHalf;
  let term = x;
  let sum = x;

  for (let k = 1; k <= 20; k++) {
    term *= (-x2 * x2) * (4 * k - 3) / ((2 * k) * (2 * k - 1) * (4 * k + 1));
    sum += term;
    if (Math.abs(term) < 1e-15 * Math.abs(sum)) {
      break;
    }
  }

  return sum;
}

function taylorS(x: number): number {
  const piHalf = Math.PI / 2;
  const x2 = x * x * piHalf;
  let term = (x * x2) / 3;
  let sum = term;

  for (let k = 1; k <= 20; k++) {
    term *= (-x2 * x2) * (4 * k - 1) / ((2 * k + 1) * (2 * k) * (4 * k + 3));
    sum += term;
    if (Math.abs(term) < 1e-15 * Math.abs(sum)) {
      break;
    }
  }

  return sum;
}

function rationalApprox(x: number): { c: number; s: number } {
  // Auxiliary functions f(x) and g(x) using rational approximation
  // Based on Abramowitz & Stegun formulas 7.3.26 and 7.3.27
  const piHalf = Math.PI / 2;

  const t = 1 / (1 + 0.926 * x);
  const f =
    (1 / (2 * Math.PI * x)) *
    (1 +
      t *
        (-0.0926 +
          t * (0.046 + t * (-0.1785 + t * (0.2659 + t * -0.1522)))));
  const g =
    (1 / (2 * Math.PI * x * x)) *
    (1 +
      t *
        (-0.384 +
          t * (1.4622 + t * (-3.3862 + t * (4.8634 + t * -2.7819)))));

  const cosVal = Math.cos(piHalf * x * x);
  const sinVal = Math.sin(piHalf * x * x);

  return {
    c: 0.5 + f * sinVal - g * cosVal,
    s: 0.5 - f * cosVal - g * sinVal,
  };
}

/**
 * Evaluate an Euler spiral (clothoid) at parameter ds from start.
 *
 * The spiral is defined by linearly varying curvature:
 *   κ(s) = κ₀ + (κ₁ - κ₀)/L · s
 *
 * Uses the Fresnel integral formulation.
 *
 * @returns local (x, y, heading) relative to the spiral start
 */
export function evaluateSpiral(
  ds: number,
  curvStart: number,
  curvEnd: number,
  length: number,
): { x: number; y: number; hdg: number } {
  if (length < 1e-10) {
    return { x: 0, y: 0, hdg: 0 };
  }

  // Use numerical integration (Simpson's rule) for robustness
  const N = Math.min(256, Math.max(64, Math.ceil(ds)));
  const h = ds / N;
  let x = 0;
  let y = 0;

  const curvRate = (curvEnd - curvStart) / length;

  for (let i = 0; i <= N; i++) {
    const s = i * h;
    const theta = curvStart * s + 0.5 * curvRate * s * s;

    const weight = i === 0 || i === N ? 1 : i % 2 === 1 ? 4 : 2;
    x += weight * Math.cos(theta);
    y += weight * Math.sin(theta);
  }

  x *= h / 3;
  y *= h / 3;

  const hdg = curvStart * ds + 0.5 * curvRate * ds * ds;

  return { x, y, hdg };
}
