import { isEmail } from '../src'

describe('(isEmail) check if valid E-Mail', () => {
    test('Empty string', () => {
        expect(isEmail('')).toBeFalsy()
    })
    test('Some string', () => {
        expect(isEmail('lorem ipsum')).toBeFalsy()
    })

    test('Email but not quite 1', () => {
        expect(isEmail('lorem.ipsum')).toBeFalsy()
    })
    test('Email but not quite 2', () => {
        expect(isEmail('lorem@ipsum')).toBeFalsy()
    })

    test('Real Email', () => {
        expect(isEmail('lorem@ipsum.it')).toBeTruthy()
    })

    test('Rejects a leading space (start anchor)', () => {
        expect(isEmail(' lorem@ipsum.it')).toBeFalsy()
    })

    test('Rejects a trailing space (end anchor)', () => {
        expect(isEmail('lorem@ipsum.it ')).toBeFalsy()
    })

    test('Rejects internal whitespace', () => {
        expect(isEmail('lo rem@ipsum.it')).toBeFalsy()
    })

    test('Rejects a leading-dot local part', () => {
        expect(isEmail('.lorem@ipsum.it')).toBeFalsy()
    })

    test('Rejects an empty local part', () => {
        expect(isEmail('@ipsum.it')).toBeFalsy()
    })

    test('Accepts a dotted local part and a multi-label domain', () => {
        expect(isEmail('lorem.ipsum@dolor.sit.com')).toBeTruthy()
    })

    test('Accepts a quoted local part', () => {
        expect(isEmail('"lorem ipsum"@dolor.com')).toBeTruthy()
    })

    test('Accepts an IPv4 literal domain', () => {
        expect(isEmail('lorem@[192.168.0.1]')).toBeTruthy()
    })

    test('Rejects a single-character TLD', () => {
        expect(isEmail('lorem@ipsum.i')).toBeFalsy()
    })

    test('Rejects a numeric TLD', () => {
        expect(isEmail('lorem@ipsum.123')).toBeFalsy()
    })
})
