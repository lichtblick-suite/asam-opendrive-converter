/**
 * Fresnel integrals and Euler spiral (clothoid) evaluation.
 *
 * ============================================================================
 * SPECIFICATION REFERENCES
 * ============================================================================
 * [ODR §9.4]  Spiral geometry — linearly varying curvature (Euler spiral)
 * [A&S]       Abramowitz, M. & Stegun, I.A. (1964). Handbook of Mathematical
 *             Functions. NBS Applied Mathematics Series 55.
 * [A&S §7.3]  Fresnel Integrals — definitions, series expansions, and
 *             rational approximations.
 * [A&S 7.3.1] C(t) = ∫₀ᵗ cos(π/2 · u²) du
 * [A&S 7.3.2] S(t) = ∫₀ᵗ sin(π/2 · u²) du
 * [A&S 7.3.26] Rational approximation for auxiliary function f(x)
 * [A&S 7.3.27] Rational approximation for auxiliary function g(x)
 *
 * DESIGN DECISION: Simpson's rule vs. Fresnel integrals
 * ============================================================================
 * The spiral evaluator uses Simpson's rule numerical integration instead of
 * the Fresnel integral closed form because:
 * 1. [ODR §9.4] defines spirals with BOTH curvStart AND curvEnd, meaning
 *    κ₀ ≠ 0 in general. The Fresnel integral form only applies to the
 *    special case κ₀ = 0.
 * 2. Simpson's rule handles the general case directly with configurable
 *    precision (N ∈ [64, 256] steps).
 * 3. This matches the approach used by libOpenDRIVE (odrSpiral.c).
 *
 * The Fresnel integral functions (taylorC, taylorS, rationalApprox) are
 * retained for reference and for the pure clothoid special case.
 */

/**
 * [A&S 7.3.1, 7.3.2] Compute Fresnel integrals S(t) and C(t) where:
 *   C(t) = ∫₀ᵗ cos(π/2 · u²) du
 *   S(t) = ∫₀ᵗ sin(π/2 · u²) du
 *
 * Uses Taylor series [A&S §7.3] for |t| ≤ 1.6 and rational approximation
 * [A&S 7.3.26, 7.3.27] for |t| > 1.6.
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

  // Simpson's rule integration — step count scales with geometry length [ODR §9.4]
  // to maintain consistent precision across the full spiral regardless of query point ds.
  const N = Math.min(256, Math.max(64, Math.ceil(length)));
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
