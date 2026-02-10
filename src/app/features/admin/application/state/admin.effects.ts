import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AdminHttpRepository } from '../../infrastructure/repositories/admin-http.repository';
import { AdminActions } from './admin.actions';
import { catchError, map, switchMap, of, forkJoin, tap } from 'rxjs';
import { AuditService } from '../../../../core/services/audit.service';

@Injectable()
export class AdminEffects {
    private readonly actions$ = inject(Actions);
    private readonly adminRepository = inject(AdminHttpRepository);
    private readonly auditService = inject(AuditService);

    loadAll$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.loadAllData),
        switchMap(() =>
            forkJoin({
                users: this.adminRepository.getUsers(),
                roles: this.adminRepository.getRoles(),
                flags: this.adminRepository.getFeatureFlags(),
                configs: this.adminRepository.getConfigurations()
            }).pipe(
                map(data => AdminActions.loadAllDataSuccess(data)),
                catchError(error => of(AdminActions.loadAllDataFailure({ error: error.message })))
            )
        )
    ));

    updateUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateUser),
        switchMap(({ user }) =>
            this.adminRepository.updateUser(user).pipe(
                tap((updatedUser) => {
                    this.auditService.log('UPDATE_USER', 'USER', 'admin', { userId: updatedUser.uuid, changes: user });
                }),
                map(updatedUser => AdminActions.updateUserSuccess({ user: updatedUser })),
                catchError(error => of(AdminActions.updateUserFailure({ error: error.message })))
            )
        )
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.createUser),
        switchMap(({ user }) =>
            this.adminRepository.createUser(user).pipe(
                tap((createdUser) => {
                    this.auditService.log('CREATE_USER', 'USER', 'admin', { userId: createdUser.uuid, user: createdUser });
                }),
                map(createdUser => AdminActions.createUserSuccess({ user: createdUser })),
                catchError(error => of(AdminActions.createUserFailure({ error: error.message })))
            )
        )
    ));

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.deleteUser),
        switchMap(({ uuid }) =>
            this.adminRepository.deleteUser(uuid).pipe(
                tap(() => {
                    this.auditService.log('DELETE_USER', 'USER', 'admin', { userId: uuid });
                }),
                map(() => AdminActions.deleteUserSuccess({ uuid })),
                catchError(error => of(AdminActions.deleteUserFailure({ error: error.message })))
            )
        )
    ));

    toggleFlag$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.toggleFeatureFlag),
        switchMap(({ id, enabled }) =>
            this.adminRepository.toggleFeatureFlag(id, enabled).pipe(
                tap((flag) => {
                    this.auditService.log('TOGGLE_FLAG', 'FEATURE_FLAG', 'admin', { flagId: id, enabled });
                }),
                map(flag => AdminActions.toggleFeatureFlagSuccess({ flag })),
                catchError(error => of(AdminActions.toggleFeatureFlagFailure({ error: error.message })))
            )
        )
    ));

    updateConfig$ = createEffect(() => this.actions$.pipe(
        ofType(AdminActions.updateConfig),
        switchMap(({ id, value }) =>
            this.adminRepository.updateConfiguration(id, value).pipe(
                tap((config) => {
                    this.auditService.log('UPDATE_CONFIG', 'SYSTEM_CONFIG', 'admin', { configId: id, value });
                }),
                map(config => AdminActions.updateConfigSuccess({ config })),
                catchError(error => of(AdminActions.updateConfigFailure({ error: error.message })))
            )
        )
    ));
}
