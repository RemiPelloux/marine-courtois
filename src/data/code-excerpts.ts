/**
 * Verbatim excerpts from Marine Courtois's public repositories
 * (gitlab.com/marinecourtois/thesisData and sit_remating_abm), copied on 2026-11-01.
 */
export const RF_MODEL_EXCERPT = `def modele_SIT(etat,t,params):
    x = etat
    μF,μM,μS,ρ,β,r,k,σ,η,𝜖,𝛿 = params

    # association of each equation to a vector element
    S = x[0] # sterilized males
    F = x[1] # wild females
    M = x[2] # wild males

    # definition of each differential equation
    dS = - μS*S + (1-𝛿  )*σ
    dF = - μF*F + r*(1-ρ)*((M+𝜖*η*S)/(k+M+η*S))*(1/(1+β*F))*F
    dM = - μM*M + r*ρ*((M+𝜖*η*S)/(k+M+η*S))*(1/(1+β*F))*F + 𝛿*σ
    return [dS, dF, dM]`;

export const REMATING_MODEL_EXCERPT = `def modele_SIT(etat, t, params):
    L, M, FI, FF, S = etat
    muL, muF, muM, muS, eta, omega, K, nu, p, sigma, tauF, tauI = params

    dL = omega * (1 - (L / K)) * FF - (muL + nu) * L
    dM = nu * p * L - muM * M
    dFI = (nu * (1 - p) * ((eta * S) / (M + eta * S)) * L +
           tauF * ((eta * S) / (M + eta * S)) * FF -
           (muF + tauI * (M / (M + eta * S))) * FI)
    dFF = (nu * (1 - p) * (M / (M + eta * S)) * L +
           tauI * (M / (M + eta * S)) * FI -
           (muF + tauF * ((eta * S) / (M + eta * S))) * FF)
    dS = sigma - muS * S

    return [dL, dM, dFI, dFF, dS]`;

export const KNIPLING_EXCERPT = `# Paramètres du modèle
lam = 3      # taux de croissance (>1)
S = 5        # nombre de mâles stérilisés relâchés

# Fonction du modèle
def g(F):
    return lam * F**2 / (F + S)

# Points d'équilibre
F_star = S / (lam - 1)
F_ext = 0`;

export const ABM_EXCERPT = `            elif self.sperm_selection == "mixed":
                number_eggs_laid = np.random.poisson(((self.fertile_matings/(self.fertile_matings+self.sterile_matings))*self.mean_eggs_per_day),1)[0]
                self.eggs_laid += number_eggs_laid
                # create new larvae
                if self.model.pop_larvae + number_eggs_laid < self.load_carrying_capacity: # limitation of larval growth
                    for i in range(number_eggs_laid):
                        new_larvae = Larvae_Agent(self.model.next_id(), self.model, self.sperm_selection, self.eta_sperm_choice)
                        self.model.schedule.add(new_larvae) # add a larvae in the scheduler and counter`;

export const ABM_RELEASE_EXCERPT = `    def release(self):
        if self.time >= self.release_start_time and self.time == self.release_number * self.release_frequency + self.release_start_time:
            for i in range(self.num_agents_sterile_released):
                sterile_males = SterileMales_Agent(self.next_id(), self)
                # Add the agent to the scheduler
                self.schedule.add(sterile_males)
            self.release_number += 1`;

export const IMPULSIVE_EXCERPT = `# ---------- Parameters ----------
muS = 0.054        # mortality rate of sterile males (day^-1)
theta = 7.0        # release period (days)
sigma_theta = 200  # number of sterile males released at each pulse = sigma * theta
tau = 100.0        # simulation duration (days)
dt = 0.1           # integration time step

# ---------- Analytic periodic solution ----------
def MS_periodic(t, sigma_theta=sigma_theta, muS=muS, theta=theta):
    t_mod = np.mod(t, theta)
    denom = 1.0 - np.exp(-muS * theta)
    return sigma_theta * np.exp(-muS * t_mod) / denom`;

export const SENSITIVITY_EXCERPT = `import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import statsmodels.api as sm
import scipy.stats as stats
import itertools

from sympy.solvers import solve
from sympy import symbols, Eq, solve
from statsmodels.formula.api import ols`;

