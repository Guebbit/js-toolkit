/**
 * Determino se url
 *
 * @param string
 */
export default (string :string) :boolean => {
	return new RegExp(String.raw`^(https?:\/\/)?`+ // protocol
    String.raw`((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|`+ // domain name
    String.raw`((\d{1,3}\.){3}\d{1,3}))`+ // OR ip (v4) address
    String.raw`(\:\d+)?(\/[-a-z\d%_.~+]*)*`+ // port and path
    String.raw`(\?[;&a-z\d%_.~+=-]*)?`+ // query string
    String.raw`(\#[-a-z\d_]*)?$`,'i').test(string);
};
