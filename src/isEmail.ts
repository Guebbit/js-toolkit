/**
 * Check if valid email
 * @param string
 * @return boolean
 */
export default (string: string): boolean => {
    // eslint-disable-next-line no-useless-escape
    return /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/.test(
        string
    )
}
