import requests
import json


class HeaderTableMismatch(Exception):
    """
    This Exception class is used to in case the Markdown table cannot be entirely filled.
    """
    pass


def hashToMarkdown(hash_var):
    """
     function receives a hash value, fetches relevant information for this hash from VirusTotal.
    :return: A Markdown table contacting data for hash - 1. File Information 2.Last Analysis Status 3.Last Analysis
    Result
    """
    # retrieve data from api
    json_data = getJSON(hash_var)

    # organize relevant info + last_analysis data
    file_info, last_a_s, last_a_r = getInfoAnalysisData(json_data)

    # create Markdown table with data
    info_header = {"md5": "MD5", "sha1": "SHA-1", "sha256": "SHA-256"}
    if len(file_info[0]) % len(info_header):
        raise HeaderTableMismatch("File Information Error: Missing values in table.")
    mk_info = createMarkdown(file_info, info_header)

    status_header = {"total_scans": "Total Scans", "malicious_scans": "Malicious Scans"}
    if len(last_a_s[0]) % len(status_header):
        raise HeaderTableMismatch("Last Analysis Status Error: Missing values in table.")
    mk_status = createMarkdown(last_a_s, status_header)

    result_header = {"scan_origin": "Scan Origin", "scan_result": "Scan Result"}
    if len(last_a_r) % len(result_header):
        raise HeaderTableMismatch("Last Analysis Result Error: Missing values in table.")
    mk_result = createMarkdown(last_a_r, result_header)

    # test output with Dillinger
    try:
        with open("sol.md", 'w') as f:
            f.write("### File Information\n")
            for row in mk_info:
                f.write(row)
            f.write('\n')
            f.write("### Last Analysis Status\n")
            for row in mk_status:
                f.write(row)
            f.write('\n')
            f.write("### Last Analysis Result\n")
            for row in mk_result:
                f.write(row)
            f.write('\n')
    except IOError as e:
        print(e)
    except Exception as e:
        print(e)

    return [mk_info, mk_status, mk_result]


def setInfoOrder(dict) -> dict:
    res_dict = {"md5": dict["md5"], "sha1": dict["sha1"], "sha256": dict["sha256"]}
    return res_dict


def getJSON(hash_var):
    """
    function fetches all information for VirusTotal
    :param hash_var: hash value.
    :return: all the hash files - JSON format data
    """
    hash_var = "84c82835a5d21bbcf75a61706d8ab549"
    url = f"https://www.virustotal.com/api/v3/files/{hash_var}"
    headers = {
        "Accept": "application/json",
        "x-apikey": "235df685bb1fb2d521122f8381e270ad3ea4155881ea07966f7840c95af8c88f"
    }
    try:
        response = requests.get(url, headers=headers, timeout=4)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("Request Error found. ", e.response)
        raise e
    else:
        data_str = response.text
        json_data = json.loads(data_str)
        return json_data


def getInfoAnalysisData(json_data) -> (list, list, list):
    """
    function receives JSON format data and retrieves the relevant information to be filled in a Markdown table.
    :param json_data: A dictionary containing all data of the hash file in JSON format
    :return: Three Markdown tables containing: 1.File information 2. Last analysis status, 3. Last analysis result
    """
    file_info = {}
    for key in json_data["data"]["attributes"]:
        # file information
        if key == "md5" or key == "sha1" or key == "sha256":
            file_info[key] = json_data["data"]["attributes"][key]

        # last analysis stats(status)
        elif key == "last_analysis_stats":
            last_a_s = json_data["data"]["attributes"][key]
            num_scans = sum(last_a_s.values())
            num_malicious = last_a_s["malicious"]
            last_a_s = [{"total_scans": str(num_scans), "malicious_scans": str(num_malicious)}]

        # last analysis results
        elif key == "last_analysis_results":
            last_a_r = json_data["data"]["attributes"][key]
            list_ar = []
            for keys in last_a_r:
                new_dict = {"scan_origin": keys, "scan_result": last_a_r[keys]["result"]}
                list_ar.append(new_dict)
            last_a_r = list_ar

    file_info = [setInfoOrder(file_info)]

    return file_info, last_a_s, last_a_r


def createMarkdown(dict_value, header_map) -> list:
    """
    function creates a Markdown table with values corresponding with a previously defined header.
    :param dict_value: A dictionary with the relevant information to be filled in the Markdown table.
    :param header_map: A dictionary with the Markdown tables desired headers.
    :return: Markdown table.
    """
    # table - each element is a string of a row to be printed out
    table = []

    # build header
    table.append('|'.join(s.center(len(s)) for s in header_map.values()))
    table[0] += "|" + '\n'
    table.append('|:')
    table[1] += ('|:'.join('-' * len(x) for x in header_map.values()))
    table[1] += "|" + '\n'

    # build body
    for item in dict_value:
        add_string = '|'
        for hd in header_map:
            value = item[hd]
            add_string += str(value) + '|'
        add_string += '\n'
        table.append(add_string)

    return table


if __name__ == "__main__":
    hashToMarkdown("84c82835a5d21bbcf75a61706d8ab549")

"""
Web Scraping:
1. we need to send a request to the server in order to get the data
2. we do this with the request.get command
3. the headers - why we need them and what they are? 
    3.1. headers are used to differentiate the headings and sub-headings of a page from the rest of the content
    3.2. IN THIS ASSIGNMENT - I use the "Accept" header and "x-apikey" as needed.
        3.2.1. the "ACCEPT" header - this is used to infrom the server by the client which content type is
               understandable by the client. 
    3.3. headers are sent using a dictionary format with the get function
"""
"""
understanding the JSON file
1. resembles a python dictionary. i.e. "data:" is the key and the value is an array of objects
   each object hold a key to a string value or another array of objects.
2. in order to work with the data - load into a Python file.
   it is easily done with the - "json.loads(string)" where the string hold the entire json file output
3. the output of the conversion is a messy python dictionary. the conversions happens with json.decoder that
   states which JSON object is translated into which Python object (i.e. JSON - array -> Pytohn - list)

"""
"""
JSON to Markdown:
1. python data to DataFrame:
   1.1. what is a DataFrame? a DataFrame is 
"""
