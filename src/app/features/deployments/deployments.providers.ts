import { Provider, EnvironmentProviders, InjectionToken } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { deploymentReducer } from './application/state/deployment.reducer';
import { IDeploymentRepository } from './domain/contracts/deployment.repository';
import { DeploymentEffects } from './application/state/deployment.effects';
import { DeploymentHttpRepository } from './infrastructure/repositories/deployment-http.repository';

// Port/Adapter configuration
export const IDEPLOYMENT_REPOSITORY = new InjectionToken<IDeploymentRepository>('IDEPLOYMENT_REPOSITORY');

export const DEPLOYMENTS_PROVIDERS: (Provider | EnvironmentProviders)[] = [
    {
        provide: IDEPLOYMENT_REPOSITORY,
        useClass: DeploymentHttpRepository
    },
    provideState('deployments', deploymentReducer),
    provideEffects(DeploymentEffects)
];
