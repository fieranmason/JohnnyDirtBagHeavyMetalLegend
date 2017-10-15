#!/usr/bin/python

import httplib, urllib, sys, json, pprint

# Define the parameters for the POST request and encode them in
# a URL-safe format.

params = urllib.urlencode([
    ('code_url', 'http://96.54.229.104/js/main.js'),
    ('compilation_level', 'ADVANCED_OPTIMIZATIONS'),
    ('output_format', 'json'),
    ('output_info', 'compiled_code'),
    ('output_info', 'warnings'),
    ('output_info', 'errors'),
    ('output_info', 'statistics'),
])

# Always use the following value for the Content-type header.
headers = { "Content-type": "application/x-www-form-urlencoded" }
conn = httplib.HTTPConnection('closure-compiler.appspot.com')
conn.request('POST', '/compile', params, headers)
response = conn.getresponse()
data = response.read()

print 'loading json response for "main.js"...'
json_data = json.loads(data)

print 'PrettyPrinting json_data...'
pp = pprint.PrettyPrinter(indent=4)
pp.pprint(json_data)

print 'printing compiledCode to "main.min.js" file...'
f = open('./js/main.min.js', 'w')
f.write(json_data['compiledCode'])
f.close();

print 'closing connection...'
conn.close()
