import { ClientMockBuilder } from './ClientMockBuilder.mts'
import { FileFinder } from '../FileFinder.mts'

describe('FileFinder', () => {
  it('matches with file base name', async () => {
    const client = ClientMockBuilder.create().file('yellow').build()
    const ff = new FileFinder({ client })
    const matches = await ff.match('yellow')
    expect(matches).toEqual(['/yellow'])
  })
  it('does not allow multi level stars', async () => {
    const client = ClientMockBuilder.create().build()
    const ff = new FileFinder({ client })
    expect.assertions(2)
    try {
      await ff.match('**')
    } catch (error: any) {
      expect(error).toBeInstanceOf(SyntaxError)
      expect(error.message).toContain('double star')
    }
  })

  it('matches with simple star glob', async () => {
    const client = ClientMockBuilder.create()
      .file('red.1')
      .file('red.2')
      .build()
    const ff = new FileFinder({ client })
    const matches = await ff.match('red.*')
    expect(matches).toEqual(['/red.1', '/red.2'])
  })
  it('matches with deep plain names', async () => {
    const client = ClientMockBuilder.create()
      .file('purple/light')
      .file('purple/dark')
      .file('turqouise/light')
      .file('turqouise/dark')
      .build()
    const ff = new FileFinder({ client })
    const matches = await ff.match('*/dark')
    expect(matches).toEqual(['/purple/dark', '/turqouise/dark'])
  })
  it('requires a root relative root', () => {
    const client = ClientMockBuilder.create().file('colors/red').build()
    const root = 'bad'
    expect(() => new FileFinder({ client, root })).toThrow('root')
  })
  it('starts from the root', async () => {
    const client = ClientMockBuilder.create().file('/colors/red').build()
    const root = '/colors'
    const ff = new FileFinder({ client, root })
    const matches = await ff.match('red')
    expect(matches).toEqual(['/colors/red'])
  })
  it('handles wildcard directories with root', async () => {
    const client = ClientMockBuilder.create()
      .file('/colors/blue/blue.1')
      .file('/colors/blue/blue.2')
      .file('/colors/red/red.1')
      .build()
    const ff = new FileFinder({ client, root: '/colors' })
    const matches = await ff.match('*/*.1')
    expect(matches).toEqual(['/colors/blue/blue.1', '/colors/red/red.1'])
  })
})
