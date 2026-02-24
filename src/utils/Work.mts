import Spinner from './Spinner.mts'

export default { do: doWork }

async function doWork<Type>(
  text: string,
  work: () => Promise<Type> | Type,
  done?: string | ((value: Type) => string),
): Promise<Type> {
  const stop = Spinner.create(text)

  const result = await work()

  if (typeof done === 'function') {
    done = done(result)
  }
  stop(done)

  return result
}
