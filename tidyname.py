def tidyName(titletext):
    nogoodname=['\\','/',':','*','?','"','<','>','|']
    for i in nogoodname:
        if i in titletext:
                titletext=titletext.replace('?','8')
                titletext=titletext.replace(':','=')
                titletext=titletext.replace('"',"'")
                titletext=titletext.replace('>','}')
                titletext=titletext.replace('<','{')
                titletext=titletext.replace('/','l')
                titletext=titletext.replace('|','l')
                titletext=titletext.replace('\\','w')
                titletext=titletext.replace('*','x')
    return titletext
