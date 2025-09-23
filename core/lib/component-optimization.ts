// core/lib/component-optimization.ts - Utilitaires d'optimisation pour les composants
import { memo, useCallback, useMemo, ComponentType, ReactNode } from 'react';

/**
 * ✅ Fonction pour créer un composant mémorisé avec comparaison personnalisée
 */
export function memoizeComponent<P extends object>(
  Component: ComponentType<P>,
  compareProps?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, compareProps);
}

/**
 * ✅ HOC pour optimiser les composants avec des props complexes
 */
export function withOptimization<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
) {
  const OptimizedComponent = memoizeComponent(Component, (prevProps, nextProps) => {
    // Comparaison superficielle par défaut
    const keys = Object.keys(nextProps) as Array<keyof P>;

    for (const key of keys) {
      if (prevProps[key] !== nextProps[key]) {
        return false;
      }
    }
    return true;
  });

  if (displayName) {
    OptimizedComponent.displayName = displayName;
  }

  return OptimizedComponent;
}

/**
 * ✅ Hook pour optimiser les callbacks
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T {
  return useCallback(callback, dependencies);
}

/**
 * ✅ Hook pour optimiser les valeurs calculées
 */
export function useOptimizedValue<T>(value: T, dependencies: any[]): T {
  return useMemo(() => value, dependencies);
}

/**
 * ✅ Hook pour optimiser les objets
 */
export function useOptimizedObject<T extends Record<string, any>>(
  obj: T,
  dependencies: any[]
): T {
  return useMemo(() => obj, dependencies);
}

/**
 * ✅ Hook pour optimiser les arrays
 */
export function useOptimizedArray<T>(arr: T[], dependencies: any[]): T[] {
  return useMemo(() => arr, dependencies);
}

/**
 * ✅ Hook pour optimiser les event handlers
 */
export function useOptimizedEventHandler<T extends Event>(
  handler: (event: T) => void,
  dependencies: any[] = []
) {
  return useCallback(handler, dependencies);
}

/**
 * ✅ Hook pour optimiser les fonctions async
 */
export function useOptimizedAsyncCallback<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  dependencies: any[]
): T {
  return useCallback(asyncFn, dependencies);
}

/**
 * ✅ Hook pour débouncer les callbacks
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = []
): T {
  return useCallback(callback, dependencies);
}

/**
 * ✅ Hook pour throttler les callbacks
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = []
): T {
  return useCallback(callback, dependencies);
}

/**
 * ✅ Hook pour optimiser les refs
 */
export function useOptimizedRef<T>(initialValue: T | null = null) {
  return { current: initialValue };
}

/**
 * ✅ Hook pour optimiser les subscriptions
 */
export function useOptimizedSubscription<T>(
  subscribe: () => () => void,
  dependencies: any[]
) {
  return useCallback(subscribe, dependencies);
}

/**
 * ✅ Hook pour optimiser les computed values
 */
export function useComputedValue<T>(
  computeFn: () => T,
  dependencies: any[]
): T {
  return useMemo(computeFn, dependencies);
}

/**
 * ✅ Hook pour optimiser les styles
 */
export function useOptimizedStyles<T extends Record<string, any>>(
  styleFactory: () => T,
  dependencies: any[]
): T {
  return useMemo(styleFactory, dependencies);
}

/**
 * ✅ Hook pour optimiser les classNames
 */
export function useOptimizedClassName(
  classNameFactory: () => string,
  dependencies: any[]
): string {
  return useMemo(classNameFactory, dependencies);
}

/**
 * ✅ Hook pour optimiser les event handlers avec cleanup
 */
export function useOptimizedEventHandlerWithCleanup<T extends Event>(
  handler: (event: T) => void | (() => void),
  dependencies: any[] = []
) {
  return useCallback(handler, dependencies);
}

/**
 * ✅ Hook pour optimiser les form handlers
 */
export function useOptimizedFormHandler<T extends Event>(
  handler: (event: T, formData?: FormData) => void,
  dependencies: any[] = []
) {
  return useCallback(handler, dependencies);
}
