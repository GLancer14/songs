type DebounceFunction = (...args: any[]) => Promise<any>;

export async function debounce<T extends DebounceFunction>(
  fn: T,
  delay: number
): Promise<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const debouncedFn = function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  } as T & { cancel: () => void };
  
  return debouncedFn;
}