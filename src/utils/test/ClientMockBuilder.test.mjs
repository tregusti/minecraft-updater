import { ClientMockBuilder } from './ClientMockBuilder.mjs'

describe('ClientMockBuilder', () => {
  it('chnages directory', async () => {
    const client = ClientMockBuilder.create()
      .file('/animal/elephant/1')
      .file('/animal/rhinoceros/2')
      .build()
    expect(await client.pwd()).toEqual('/')
    await client.cd('animal')
    expect(await client.pwd()).toEqual('/animal')
  })
  it('chnages directory with root relative paths', async () => {
    const client = ClientMockBuilder.create()
      .file('purple/light')
      .file('purple/dark')
      .file('turqouise/light')
      .file('turqouise/dark')
      .build()
    expect(await client.pwd()).toEqual('/')
    await client.cd('/purple')
    expect(await client.pwd()).toEqual('/purple')
    await client.cd('/turqouise')
    expect(await client.pwd()).toEqual('/turqouise')
  })
  it('lists the files in a directory', async () => {
    const client = ClientMockBuilder.create()
      .file('/animal/elephant')
      .file('/animal/rhinoceros')
      .build()
    await client.cd('animal')
    const files = await client.list()
    expect(files).toHaveLength(2)
    expect(files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'elephant', type: 1 }),
        expect.objectContaining({ name: 'rhinoceros', type: 1 }),
      ])
    )
  })
  it('lists the directories and files in a directory', async () => {
    const client = ClientMockBuilder.create()
      .file('/animal/elephant')
      .file('/animal/cat/tiger')
      .file('/animal/cat/lion')
      .build()
    await client.cd('animal')
    const files = await client.list()
    expect(files).toHaveLength(2)
    expect(files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'elephant', type: 1 }),
        expect.objectContaining({ name: 'cat', type: 2 }),
      ])
    )
  })
})
