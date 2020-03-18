// GOOD RX //
const {Client} = require('/opt/node_modules/pg');
var rp = require('/opt/node_modules/request-promise');
var db_host = process.env.DB_HOST;
var reg = process.env.REGION;

const cookies = [
    // 'csrf_token=50851b2872a34ac5ae3ad4dafa82371a; _pxhd=68a9b83482b27e5dee77fadcb3f145cbcf52c97cd68621fae96879e4249f0eec:3ee73db1-4835-11ea-9a82-bfd500331ab4; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.83355784.1580920413; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=3ee73db1-4835-11ea-9a82-bfd500331ab4; rsci_vid=95a04e3d-24bc-d3af-60ea-89f8836b63a6; ki_r=; ki_s=203440%3A0.0.0.0.0; goodrx-v2=75b2b17a7030cbff7a8882b47fd4a88365395bdfe4/m+HZEua7wk+ZvB+D6jNW2uGvgbfZ4k/d5iEiJG1UxJff+Y9FcMBsXPcqDsqT8jtFCL987FU8XsFfQW0ZCCxqhKvNkiSOfe3gzSwD+f0I4L+cwIqr8Grp49VNiMPYWwHLIIcwapCycYs1ZEfdd0IBfxcHsIalJB7W6I3lTGtIdqIeQnX9gk30+2kqInfVQFnJh6OiX3+kRwplk04Vplc5c1phrb1YYRMVFN8FscjaoSPq6xGQGSz/whNRJ/EjOITkLkN5qhkprJq1CNF23TI1B/z/f9bDXr/KNMokyxI2Ug96VKBvUksPuYtTqj5cOFhjoA8lRgBy4omvzILJd3bUGauE/gLWcURUdAwgTWxjVRsrqCqZcYbluIxSt/vPOaO2RDKKJ3yNbmKcmgUpq/rhgmQ89ZI0hj5YL3goSrZLTtsQdkBF+2Qa7oSgUbX4FNYLbBgXr2CVAVTfWmXRpjn5xnujV8gmNHPGSzFGA3bLvPmQUJQONv3H07cYmPeAFyYa1xZjnqDri7xVYBqB4zpeCKX+ajtHkZZWeyykQzY5h94q0jGzMx0s/y4g0wpuqGXQA/HTJGNtPD5UPhWJPj3EYgWCddphaYyr/lhYBuWG/MYVjxPKnoDyGESgwPf5lwUhF99I+e57F7DkocgoVexTagcqJueWpig4FBnPHRLHdf7dBL7JJoZN91xxlHnoYDwW+25sos2JuvwBS2VDcdGQUJ230c8VATK7N3HTaA0ZEqpooMVhQd2w=; grx_unique_id=f51113523c2a407eaeacde2d81d9c924; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga_YMS2P9FQ4X=GS1.1.1580920425.1.0.1580920425.0; _ga=GA1.2.420488000.1580920413; _px2=eyJ1IjoiNDdmODhmODAtNDgzNS0xMWVhLThjMjctYWQzZjU0ZjgxMTNmIiwidiI6IjNlZTczZGIxLTQ4MzUtMTFlYS05YTgyLWJmZDUwMDMzMWFiNCIsInQiOjE1ODA5MjA3Mjg0MTMsImgiOiI4Mjk4ZjRiM2QxYjBlODkwOGMwNzhiNDNiMGI0MWFkZmRlOGJiMDI5N2FjYmJiMDg0M2QyYWUwYTI2NDE5YTAyIn0=; ki_t=1580920415562%3B1580920415562%3B1580920428505%3B1%3B2',
    // 'csrf_token=50851b2872a34ac5ae3ad4dafa82371a; _pxhd=68a9b83482b27e5dee77fadcb3f145cbcf52c97cd68621fae96879e4249f0eec:3ee73db1-4835-11ea-9a82-bfd500331ab4; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.83355784.1580920413; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=3ee73db1-4835-11ea-9a82-bfd500331ab4; rsci_vid=95a04e3d-24bc-d3af-60ea-89f8836b63a6; ki_r=; ki_s=203440%3A0.0.0.0.0; goodrx-v2=75b2b17a7030cbff7a8882b47fd4a88365395bdfe4/m+HZEua7wk+ZvB+D6jNW2uGvgbfZ4k/d5iEiJG1UxJff+Y9FcMBsXPcqDsqT8jtFCL987FU8XsFfQW0ZCCxqhKvNkiSOfe3gzSwD+f0I4L+cwIqr8Grp49VNiMPYWwHLIIcwapCycYs1ZEfdd0IBfxcHsIalJB7W6I3lTGtIdqIeQnX9gk30+2kqInfVQFnJh6OiX3+kRwplk04Vplc5c1phrb1YYRMVFN8FscjaoSPq6xGQGSz/whNRJ/EjOITkLkN5qhkprJq1CNF23TI1B/z/f9bDXr/KNMokyxI2Ug96VKBvUksPuYtTqj5cOFhjoA8lRgBy4omvzILJd3bUGauE/gLWcURUdAwgTWxjVRsrqCqZcYbluIxSt/vPOaO2RDKKJ3yNbmKcmgUpq/rhgmQ89ZI0hj5YL3goSrZLTtsQdkBF+2Qa7oSgUbX4FNYLbBgXr2CVAVTfWmXRpjn5xnujV8gmNHPGSzFGA3bLvPmQUJQONv3H07cYmPeAFyYa1xZjnqDri7xVYBqB4zpeCKX+ajtHkZZWeyykQzY5h94q0jGzMx0s/y4g0wpuqGXQA/HTJGNtPD5UPhWJPj3EYgWCddphaYyr/lhYBuWG/MYVjxPKnoDyGESgwPf5lwUhF99I+e57F7DkocgoVexTagcqJueWpig4FBnPHRLHdf7dBL7JJoZN91xxlHnoYDwW+25sos2JuvwBS2VDcdGQUJ230c8VATK7N3HTaA0ZEqpooMVhQd2w=; grx_unique_id=f51113523c2a407eaeacde2d81d9c924; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga_YMS2P9FQ4X=GS1.1.1580920425.1.0.1580920425.0; _ga=GA1.2.420488000.1580920413; _px2=eyJ1IjoiNDdmODhmODAtNDgzNS0xMWVhLThjMjctYWQzZjU0ZjgxMTNmIiwidiI6IjNlZTczZGIxLTQ4MzUtMTFlYS05YTgyLWJmZDUwMDMzMWFiNCIsInQiOjE1ODA5MjA3Mjg0MTMsImgiOiI4Mjk4ZjRiM2QxYjBlODkwOGMwNzhiNDNiMGI0MWFkZmRlOGJiMDI5N2FjYmJiMDg0M2QyYWUwYTI2NDE5YTAyIn0=; ki_t=1580920415562%3B1580920415562%3B1580920428505%3B1%3B2',
    // 'csrf_token=50851b2872a34ac5ae3ad4dafa82371a; _pxhd=68a9b83482b27e5dee77fadcb3f145cbcf52c97cd68621fae96879e4249f0eec:3ee73db1-4835-11ea-9a82-bfd500331ab4; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.83355784.1580920413; _pxvid=3ee73db1-4835-11ea-9a82-bfd500331ab4; rsci_vid=95a04e3d-24bc-d3af-60ea-89f8836b63a6; ki_r=; ki_s=203440%3A0.0.0.0.0; grx_unique_id=f51113523c2a407eaeacde2d81d9c924; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; goodrx-v2=08dee705ea92a04b34552d0117a367f0b3d68645j+slkdMUk4PaBq1mj2pdA+xFi7ZOBD74lw/J69pGrchTct/QWqsvxnlrKw0TGb6PESuFvdWQDE2f4TrjtiJGd7RdNF3qjTc+KrZio1VQqy2yX3qLne4F8/MwWh0eaKL3SbPdibY0jz3BbP8WEU8GalAlrtt1F9yKB8KHtNxKg3b9uog8w+JYWYolcF5yqyZp2AWaH4Ua13s/KvksApouT15HAartROX6bf5vADYFuhKu2HlLNL15iKArklYK3xhK2y6wbvnIPgt/kEy99HgfRbvKKqryasTHZ4910gMtC6iI1R9ACwHTtMAWhkEgJwD7znXNFD/uTUjcQGk6xBtOQkNOSCxbVbARVGPz4iFWOeZ8VpqZ1vWZPs9K9flUR/qFHdaHPJ0xwHxt4PyYpC6WOuL9cvMsS4VBeVK1FpQgaqCkeR9NPt7VvX2LZXucHdPqfmh9g4anP7G2C6wbDCTnJqOyLYT4opezuG+rh16UEMY7DYtzb1wVNH4GLIz9o7D9G/uGFRrvYkTvmCz8SircdqucbQaLMS1ENTFBZH6HWW3j8cqpf+LK2FievWLpk6E856bdtricofKIy/urufcgPH3LADZVaBVYJ4ZOmp50ktY4JtgF0RhcK6iMn6uciFtSu5MEjy58zGBLy6hzWB9zUJNChLKfYVRUVd5uZXwTs23BMJWFlq6DN7R7QaH7jsGiEdxS7L+nFWbzKvf0BUBNUR03LJmdXgExZVyc7XU6RJg9sXLs7PVaRF4=; _ga_YMS2P9FQ4X=GS1.1.1580920425.1.1.1580921009.0; _ga=GA1.2.420488000.1580920413; ki_t=1580920415562%3B1580920415562%3B1580921013894%3B1%3B7; _px2=eyJ1IjoiYTU2MTQyYjAtNDgzNi0xMWVhLTlmMTktOWI0OWVkNTU5MjM5IiwidiI6IjNlZTczZGIxLTQ4MzUtMTFlYS05YTgyLWJmZDUwMDMzMWFiNCIsInQiOjE1ODA5MjEzMTQxNTQsImgiOiI5M2U0YzAxNTVmNmY0ZGY3ZmFhN2M3MmU0ZTIzMzZlZDNiZjdhMTU3YmJlMjZkNjRmNGRkZTE2ZThkNTgwODVhIn0=',
    'csrf_token=50851b2872a34ac5ae3ad4dafa82371a; _pxhd=68a9b83482b27e5dee77fadcb3f145cbcf52c97cd68621fae96879e4249f0eec:3ee73db1-4835-11ea-9a82-bfd500331ab4; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.83355784.1580920413; _pxvid=3ee73db1-4835-11ea-9a82-bfd500331ab4; rsci_vid=95a04e3d-24bc-d3af-60ea-89f8836b63a6; ki_r=; ki_s=203440%3A0.0.0.0.0; grx_unique_id=f51113523c2a407eaeacde2d81d9c924; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _gat_UA-24914838-1=1; goodrx-v2=bc534387e1a0c2ea4ce627eae505208504dd9a87s4hWZt3LZzTOAJq1qKWnY/lzuf+tI1Wif73Q1Zx90fH/t7/oh+Mur4t+kstkgXNAJEZdLy8OoY6/7oPS5MZShw4txps2HM1p51mFrFl4XQheYnY7xSQ0bljxbuJtQyGFD1GDZXUdDhZwnD80aKJKrupAizwdjCJ3rsOtik/8V5hJ9dLyAQ1IoT0Jaixklnv8X5N1P/yVjSvloD6IuydaezthccP+BEw05GzXH6DcmltS8aJQ8ngC0TPZYpyaSUUUt+PAUmMTgAId2zgNp8K/oOWOLVYmIkMr87hNF//PYaLMPc9cM9Xm/9uUI7XRaLAxxl0B7nTtBBKMnRQBaCIWNgPT0vDMzcIrEN7i9CJBBCPP5dR/FglUswLbWgvcUgTEZvKptYlLDMsPZyOa3fI4UAoTZaJ/V04vxubvpDStTjEUj2CaV9pQsill7aJRk97k7wsOnKUG4OoM85+Cw2+7Y84rA9lBAMKBs/WEWQC1rFagjImazGW+PKfteHBNXU2oBGXNVZIZTH0qJ+dram7kx1PlDlbRWUfvCqTLukuPQVaFBgqK8hJ1wyEbH7pW6Ej1pA0tZABvQehcC1MdaB60uviHRGfSY41b3kemI9GEbRIsv56t1PI+yBn/As3N4VU5dvYEHaSNL8aolpphnBhjZ5IzOrXKQgg/GNgoys7Nt2qiV6h+T2rZ1FHR5/Gcjuc4SSYn3xsAjs8VkgYrfmZLm+rFZ+UeVNvUhkspc4M9GU5Q0gdJqwHRzxU=; _dc_gtm_UA-24914838-1=1; _ga_YMS2P9FQ4X=GS1.1.1580920425.1.1.1580921064.0; _ga=GA1.2.420488000.1580920413; ki_t=1580920415562%3B1580920415562%3B1580921067945%3B1%3B9; _px2=eyJ1IjoiYzVlN2Q0NDAtNDgzNi0xMWVhLThlMDUtOGQ4OTdlZTg3ZjcxIiwidiI6IjNlZTczZGIxLTQ4MzUtMTFlYS05YTgyLWJmZDUwMDMzMWFiNCIsInQiOjE1ODA5MjEzNjg0MjgsImgiOiI4OTMwZWYzMDZiODJmZTVmYmM1NjliNDY4MDM5YzI4YzExYzliNTk0MzBkYTJlNzdhYjljYmY4MWIxODlkZTFiIn0=',
    'csrf_token=06280718a7dd4f98a387d67d54a24a23; _pxhd=01e2559ace7a600c589fe5b87c1463570f081dd488731fc2d27e2fb5cedf63c0:e4e024b0-4836-11ea-aa06-55d0a019a62f; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.1042775980.1580921121; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=e4e024b0-4836-11ea-aa06-55d0a019a62f; rsci_vid=1a7ff638-2abb-764a-980a-49bd4e87becc; ki_r=; ki_s=203440%3A0.0.0.0.0; goodrx-v2=020b57ebbc936c6b8280945092d7bd03eac4d3d0IhHbL19QPCH5OVrb/E1MHdlO42b+IMTnTykyWbaGiTgqcQSRd8TE9f8C03/Ikbp2sXR67Cy57AjP+DpNzOmxW+E+ITrCDtcnO+A73L+m5x5YXfKmVnoxaZrl27js2upTQ4SyhoLQsT6oSvXbiX37wLXcXgHNc35JbT3xbliz5tN28Fmsg5rdQ5OGj4GHl72BSwiDlo3OebaEgyaZDoxPY7ruvBmqLTtmcfX0MCUrBLLYTV9rg6hPL1UVWG8hoN8I3QlI5w0tqUiglw/NlLRBs0vOssnlZzSDBkBj7uXHDbTBLQv7GCpWIBGDhQdelMzqrb9AjHplLu9ZuEMdiDB43IR0XtOQnJMmAVR4QbrdqT4aKPWU2CtK24RyE9p+QOy2ETkPIiJkwry6T6VkeSL1XqZs73RPCzyezX5fJhLB3+VT2IrqRE73js4E2PJYNF89ACCA4DuMw901I2+yfJtgUNBNxUxVNuCeOHHR1kYOFYlZdkbV4fUyAP8QXSLvKruSo4xHAAp1ZegI1AIc06o8QioaLUQO5qcYMI9L/1e2w0N5eFTx8RQoEK9VdpTS6hqAG0yUDyC/SBMmhiqIvdRR8ztsPMghWFPzB11y1UOnLiHbcLkXSxqXLciuyb9cqG4T3MGcYROWHCRKgHCylf5s8KHXLUutPFZJrozSaaOGXg7QXUe4koBfHsfdgFFE71KQssN24sUzzDlOOfw/eLl/jiQRIYkTT3wlh5GCJruu0iqou1i0Pq9DWxM=; grx_unique_id=71a1b0f49df64159afdb0b7fd3581bcb; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga=GA1.1.674199386.1580921121; _ga_YMS2P9FQ4X=GS1.1.1580921125.1.0.1580921125.0; _px2=eyJ1IjoiZTkyMDY2NzAtNDgzNi0xMWVhLWI0ZDktM2YzZDQ2YzAwY2Q2IiwidiI6ImU0ZTAyNGIwLTQ4MzYtMTFlYS1hYTA2LTU1ZDBhMDE5YTYyZiIsInQiOjE1ODA5MjE0Mjc5NjYsImgiOiJmMDM2ZjAzNjEwZjdkYmI3Y2UyOTA3YTgzMTJjZDMxMzg4MzgwMjExNmYwYzA2ZWRmMTMyODliZGI2MjNjY2NlIn0=; ki_t=1580921122517%3B1580921122517%3B1580921128243%3B1%3B2',
    'csrf_token=54cb60981b92495e89b74f4ce8a4bc94; _pxhd=c8bc6ea392f2f16b8d9cfaf61ffe593c0f569af0d4f8ca896554191ff937fccf:072ecc10-4837-11ea-9729-5bd13028004b; myrx_exp_ab_variant=experiment; variantCookie=2; _gid=GA1.2.1462994139.1580921179; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=072ecc10-4837-11ea-9729-5bd13028004b; rsci_vid=79c8cd12-60bd-565d-89e5-ea3930575fe7; ki_r=; ki_s=203440%3A0.0.0.0.0; goodrx-v2=d4517aa25134c3e36a623be56bae526276d31975Jg2E8I9z6ytCqkb8gcmIFnKJ8BOKzcKsxyG3+I2brnnJUSlT3ly0RVVOARrxNjwi1hszbGRM1t6PL2x2rGFCtHvh63RAXucVcLzy6ccu+9LHSXwtmv9Ok0Q3Diud2M2ZFXu/OoaX8x+2i7Iyraa9tKeqgjaU25B3uJ1hlkPot3qIoYBMhviDQ+m55L15C2nrpDnIhW9G+IbnUh/SXk5a77USd0N11hh2s9i/djA7ll9tBvpy2fgBww3KX8Jip77HFFBRvRY3GuRWgmCBXoqcSMB6A+dCuipFDj+bm+HJ82iNLF5DwwLBumGcXRdRGAoF5+Aczpj3nGk+mMzve0kQ7pokvEd1cKPgX6gcKAr11/Bcvgb1yFPyxIAnt9K3qC68U3mCGO1sw2m+5e0TxWtsrrxZEshwLRQkHi3IzoT6ehgxfwhzMMrL8ULHJM5vD9YnU4z1V1v/PB9q8gs+xnqe02k8qxTwbIsAputkHEGW4DUAGwVksGO3iQ7VplkF9aqbtv3PCgcsBHxEXF9a5rneMkNWzvEPtKGw74x1mQFXG2QhzRBmbwKW48ZiUk4bL9nPT3NBXgB2PXB0m0ffDJWva30rYOWNbLLI0uGhkPFbQdDw6RM6cXDCOo7GqUA56+enEEyY5moxVGZPPJCYzeBdX5oLMmT3fJgn1SJgj74tPq2ARSK7mdYXHSYU+nQafk7FkDCRtBDmGPrVXD6rU337VIpDWatgkMAo1y7/8IE9Rg8M1KuhBAHEfHM=; grx_unique_id=6505d327a5e343efaf26635649e6ca5e; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga=GA1.1.347027309.1580921179; _ga_YMS2P9FQ4X=GS1.1.1580921184.1.0.1580921184.0; _pxff_tm=1; ki_t=1580921179685%3B1580921179685%3B1580921186433%3B1%3B2; _px2=eyJ1IjoiMGJlZmZkYTAtNDgzNy0xMWVhLThjYmMtOGRhOGEwOGZjOTg1IiwidiI6IjA3MmVjYzEwLTQ4MzctMTFlYS05NzI5LTViZDEzMDI4MDA0YiIsInQiOjE1ODA5MjE0ODYzNjAsImgiOiJhZTQzOWRlMWI4NzU5YjZmNDliNDEyNDQxMWY5N2Q3NDVlYWRhNDY0MjZhNzc0NmMyZWFjYTQ2Mjk5YjJiYjU2In0=',
    'myrx_exp_ab_variant=experiment; csrf_token=0a96fc9a44c34c448c74e8129bd7493d; _pxhd=9e7d14c4a7b24c7c2c7064dfcbacc8aea016df1e424ea676094210597900155e:265e0b00-4837-11ea-aafc-3929a5779803; myrx_exp_ab_variant=experiment; variantCookie=2; _gid=GA1.2.1251238559.1580921231; _pxvid=265e0b00-4837-11ea-aafc-3929a5779803; rsci_vid=080d6fce-e4e9-f80d-772c-0972df28bce8; ki_r=; ki_s=203440%3A0.0.0.0.0; grx_unique_id=4994b9d8db2c4f4982f9965876bb43be; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; ki_t=1580921232332%3B1580921232332%3B1580921272390%3B1%3B4; _px2=eyJ1IjoiM2YyNjdlYjAtNDgzNy0xMWVhLWFhZDMtMGY1MjVhYzhjNmRmIiwidiI6IjI2NWUwYjAwLTQ4MzctMTFlYS1hYWZjLTM5MjlhNTc3OTgwMyIsInQiOjE1ODA5MjE1ODY3OTcsImgiOiI3YmQxYmNiOTNkMjNkNTNlNDQyMWZhMmEyYzZmZWVlMjgxODc5NWUwMjUyNjZhMDk5Y2ZjOTQwMmQwNjY3ZjNiIn0=; goodrx-v2=08a37334097b278b7832bf7f771401bc1b1f7e1ayFzb/2u1My7y5mUTpdlhpPAzZ0oWMlugchoJPwATXzjPib+KARDCXDK+63NwbdcQfyXKkl7zUfGusYXmtQK5W9uyUk7MsN+ZQ9MeCyAeNNjhoAvIspR1wVDaL2pzVTjlL6crGhJ8XaMatr+ozXfSkDWASgXTAV427vvDY8hu3CLSHvtZuWdGpmOk6pZWaeJX4eMYiC0V49Fx51kSxw52pAEVmNlhVBkbafU5NzXR2ZxF7mTmkbJI2S8s04S3EeA3ToRMuX6a+bHQHd5XUsSt4JcCvEjS7b/gSMN+/nH9/o3bR3Z2EdEzQhsFGu7/l1nzydiNkBl+tTxfFKdkRiQojG4t35JyMuS2ob2MLKLEr8hH5SKwMXPCswbNvqZFCn4C9/Wm2qzUGcBZPf0LceRHPPc/BKb3/y6QpA26lRL6KENRA1o0hQdq1NwpegwztF1tfFzPylQeneFjofWlqb9kqBEAdXbp+1uor/7GC1Lr9f4T+mQUIWoF57unj5FJH4TrHmvTXv9/Xqd2pBate8aJU3EyHNVcCwS/w6hH61aKTE+Nctd8FN9q8/7MfBrYedGjCH5Z7EVjsC7EpuDkf5+h+eSEBMWq6q2u3nuyuoaPor0wztPj4ZlSEB37Qrk2NRhk3lbMbUz2J76wvJnX5pD6/GYCK23hDUZczrwSjGogj9NkzH+hJkSkYDcAl8bGmi41hrh11MmEyJ3z7pO0n1+rjFtnf6sYivlJXHM4v+lsgPq2twMZ9Lq4jjY=; _ga_YMS2P9FQ4X=GS1.1.1580921239.1.1.1580921289.0; _ga=GA1.1.809338575.1580921231',
    'csrf_token=60052d06a78b46529c40a75a8d36eb2b; _pxhd=7e6f9f528b558d71e29386ba62d2aeac3be194eb356eca75db69362ab71c70ac:68fdb501-4837-11ea-8fd7-8944f6750bc0; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.764823143.1580921343; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=68fdb501-4837-11ea-8fd7-8944f6750bc0; rsci_vid=013331f1-7a04-036d-26a9-00e7b6e83481; ki_r=; ki_s=203440%3A0.0.0.0.0; goodrx-v2=ef11d65d7cd3b01e06ef779c8a12b779d007ed298ak4FDHry1/5dj5OPTkEQZwZStmzmFEq0nkRY3iyk7FTjC62VLHamJwhEPC/wSUViRZKPwdQFiVZlxwbBCgxJMCIpp8aCN6H2SfFkcEWemP0BbuxVC4upyd8hESDadw/12ZqwlVQgspz5/vRd6lrGaKeUUNltr9Hc4fB34+1RvvhvXHP5XV5DzdoxTVYRd1xkTx1TvACBeqKrlCld3h9fbRKlSHm/qbMGxChZMRtiL3J5fEUoil7hNkeHYhqmkJv8atYNGCt6pyQNF05uLQngdsgLtZ585jsTGdmZAaBWG1IpHT5wx/d41XHDfxHD509oYV1hRX1WvASri+LER0iw8o9qUtFvsKsKuArkCCGLKeansxTbEC2SUHdXMbTbQ7c2AHx1t+xnYyC3N2sqGQJp6EZIDF2J7Yr9VH5Go1/fIpjxCoveChIE3bXaxc3IDerokzBN1El9axbpCymZ9oNjRuiMkAdk415/P1+tqnSp8m8clScrso0wY2goVv6/5tjKSRg4XXYBDbxj4qFQy/yyXVlQcDCR1iqw+h5sO30BQrrvSXCVERacGQVkpL1Eh/bw1oZTQeoT/EuoF34VkeLERyZu+w2aGOI5NzKXu3Cc2rybd+LTBSCyIaBSL+guaKVgODg7llcppoDOmoMQCksDrgegxE+S8lpXojqaCqLh+Zse9n07eD8MfzxdQve0GBv+jW/dts1RsgqXI+j8/0b82kZGuLwY923eUYJVp2PHwpTXsQ9a+lKu5w=; grx_unique_id=2caca1531f974328a4049819e997279b; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga_YMS2P9FQ4X=GS1.1.1580921347.1.0.1580921347.0; _ga=GA1.2.151852255.1580921343; _px2=eyJ1IjoiNmQ4MGYzMzAtNDgzNy0xMWVhLWFiOWQtNGI1YjIxYmMwNDllIiwidiI6IjY4ZmRiNTAxLTQ4MzctMTFlYS04ZmQ3LTg5NDRmNjc1MGJjMCIsInQiOjE1ODA5MjE2NTAyOTEsImgiOiJjNzY4NmY2ZDMyOWE2N2Q2NzgxMzU3MWI3ODAwYmJmNjZkNjc5Y2E0MGVmZjhmMDFjNDA3NGUxMzBjYmNiZTBjIn0=; ki_t=1580921344233%3B1580921344233%3B1580921350527%3B1%3B2',
    'csrf_token=60c15b3bf5a54701b4c5ee47a185a2dd; _pxhd=c749fb71ad10d2b211268890e5bcbef80c4fe65aa1fc530a491723caa75284b4:8a1b7d81-4837-11ea-9280-85a7eea771d8; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.76046176.1580921398; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=8a1b7d81-4837-11ea-9280-85a7eea771d8; ki_r=; ki_s=203440%3A0.0.0.0.0; rsci_vid=306865ee-72fe-4ca2-d0c6-b59f2c2cba4c; goodrx-v2=db1063f98ae8bc43840470694b223318223d9db35nvN/YJEKPBfmlZeZlPCATXLhYUZ5lSUazoBHpICfb3jjJIaa8FFFF8GkNw3kNtM+v/iAE2IFKJykyXFJ4MMeTA2BGz8Fy6FK+oLAceYzcutOtwMPSrDEWT7IYwgkcirYKRQKaVx/SCcnlMW/GwQxcJDhvNqAMYaiMAPdnzKKBw21RVHUEVt13UihoPHM2kbGrc7jmgnW3LWjxVv/85xKyDjzvigNHJGny6KYUAhW4Kn3KGXhn+Tf2IUh0i610hSSseCBlv9I7vpiazNh7msChidX5UV2uVLEKEde4jevUWXJsH1VKSHORhIcThn9EcM6dJwzBONyaYfz68ArQgME8dzff+l9H/MDC1EK0cQ4/AsvlnEFE1Sf6sw5aTLughAVJkgoJkV9TPqOSmCJBF6SbYVqtMz6ynettZjSBEyq7HLMbS2JVwfetLSCIoujx2W4to/m+lXdC9uN1Cm0sxxAiVnmuiaG9dWPLF+/+XjoclVwWa1om06E69n44fqhr0lmO6EnYUht8fdY3lEEOMMufzUJ1fTfyrZZCrHqqcQhv81+zEm2DuiJ3IlaE4dft77MtJ6piYEAi1zPyWj8klblYaKi58njmpN8TOkTEn6F8Qv1j1AvaKawmsTnPV6xE1puxvjJCIDiY0EYgjIu3+IP0wdUeLMZ4RwKcC8+FbrLz/vtQQLKEFKlVigZ5b2J096T9jcNgJjTnGz/NA/UoUIUhOuHY69nVORERiS/ZYQglkVG9v0kinRpnQ=; grx_unique_id=aae1685c445348bc848552cf4f4d1a45; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga_YMS2P9FQ4X=GS1.1.1580921402.1.0.1580921402.0; _ga=GA1.2.1028995308.1580921398; _px2=eyJ1IjoiOGUwOWNlYjAtNDgzNy0xMWVhLWE1N2QtY2QyZjgzYTA3YjVhIiwidiI6IjhhMWI3ZDgxLTQ4MzctMTFlYS05MjgwLTg1YTdlZWE3NzFkOCIsInQiOjE1ODA5MjE3MDQ2MTEsImgiOiIyNTc4NmI1YjlhNjg4NDk0YzM3YTdmNjg3MDliZWUzNmU5ZmEzYzFjYWIxNDFmYmY1YmIzYzdjODI1OGRlMjgwIn0=; ki_t=1580921398402%3B1580921398402%3B1580921404891%3B1%3B2',
    'myrx_exp_ab_variant=experiment; csrf_token=5144820a13a0424ab3325c0312fd184f; _pxhd=85e82583b18a14edd63fc0f110de44ac0a1e7d804e9f9afdac4111ba2aa96b25:a3487f60-4837-11ea-a1da-e57145d62a4b; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.930881043.1580921440; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=a3487f60-4837-11ea-a1da-e57145d62a4b; ki_r=; ki_s=203440%3A0.0.0.0.0; rsci_vid=a59f1fdc-8e4a-2fc6-62d1-e8733105a11f; grx_unique_id=e2faf45f355847aab5ae172a7ed6425d; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _px2=eyJ1IjoiYTdhZGFlNDAtNDgzNy0xMWVhLWIwODMtNjk2YzI2OWNkNTI2IiwidiI6ImEzNDg3ZjYwLTQ4MzctMTFlYS1hMWRhLWU1NzE0NWQ2MmE0YiIsInQiOjE1ODA5MjE3NDc1OTcsImgiOiJiZjdkODRjYzYxODU4NmQwZGI3MjMyMjJjYzczNzNmODEwOTNiM2IyNjg0YjFlYjg0ZjM0MGFkNDU3MGYzODYzIn0=; ki_t=1580921440804%3B1580921440804%3B1580921447939%3B1%3B2; goodrx-v2=10cd3de868df3a8cf58023e3a7ae38ccca504e54SkJJIEfFjXytuRvgm+SI1kJHN1CMcd47a4NojCLi4hHk/+92cKarj48bO0wl4r4Tab+sm0VjtpqulcPMfd/Qn1mqjMvWs2sxktqgxqi1SHckHQ13xmTvS44L0B0GVPMMCCT8G4MBMWspJ1sa6ivpwzdRbptAic3IlJw5BqRcnLbwxwFECDMUUod3NuwkO7oFkbnhdh6lXUuAybDCZezpQDxyFMSY3FsMFHpNuKgdQrWzZf+FieOWM/q7UPbLciC0nQQTYGY4cQFvAGJEA9wOKqd8zDnBIFek4HcCwcXqESLuuIqEQdonUJgGQhqhB/gcaYiuK7SzSikjWXUfPYDt1mEkBN6SIoJt3iAB86JwnPxTrjp5rmcpEWr5LpJYhPoXeEfY3xjcpo0LUsUMeWdjWYaSM17tsIwaMZ3fXK/P0M+tzqaISIBVU/MZ2icKrs7tWqdy/kpiaHDTKm8nTq7DqLS2vxWvWEe/f+6R9iXp8EyU/nkZpnrSJ0UzN2M6lUkWmdhnknHqdOD+LMTPrdtH7/iylqjQSsF9tk5SV5x9MweRlZLnrHY6/0MU9uAfZhRKzaOs0ZbQFd9yLWNEqGdfL37vuzI8v6LFhsxYbIQaylliaelv+DHsoEKjzyjXtzjEHKHGX3QLUer0cHYRn6vohp24CwUAOVvGR/BK/9AmPEJtR01A7ICZc5nTyR8qQE7Z1Oj2Y+kP/mvc+T/rvGOUF7xg9cA2AI0B4QrQpU5KyqWXXdUcFba7Boo=; _ga_YMS2P9FQ4X=GS1.1.1580921444.1.1.1580921456.0; _ga=GA1.2.1254411056.1580921440',
    'myrx_exp_ab_variant=experiment; csrf_token=36e28c25caee489eaa46f0d69d155739; _pxhd=b53a7bff7d0d0549c45b7f39135d8904f3835d7f97ff0d7ead2679aded186911:c3998201-4837-11ea-a4b4-19e0d7e49955; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.746609934.1580921495; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=c3998201-4837-11ea-a4b4-19e0d7e49955; rsci_vid=dc67c4be-7d51-80f9-d8e1-4ef07ed7993a; ki_r=; ki_s=203440%3A0.0.0.0.0; goodrx-v2=768a9d558ff85559ae1b23d2a3fb1d38a2f911946Sc/z5otS+W3+A5c3+pPxCwXzyQnDoZaXxlfNHjR2UNa5s+T43rgZTOGi2CFiv+F07L2d1oktZ6pCOtY0V3Gw+WIUS8i0Bb0/NYii/PSNt8Jux5YsNFc/6j9CWY7VnU899vw3MoZkodAwadc0dMi/TQVMwAGVewUu9iPuINMQLlcFpUyrioKK+xKVQRTEQf7sQ/MUU3Ack51Unv+bKJcxZCQwv4e2fjLlqPVnCbXJn7aApal2jjGoi6jJZvu2DzRSMnxkIZV0dgdu4/Aj7YRhO6owQMbpHWoleestP8i7lcwaZeQrvhB6qbPlzgTIWL6bSyRsKtuCl1hDe3Cho/cOaurSgFlSxmclAy6C0Kc0zSRCwQYajin9H7m+/BsXJWcLU/FmsDM2m4eZdlTxYIm7xT25y5WD6dmBc7MKWn9EUSbkzhbSsW/0vC4VgNGJ8242SPt7kLjKTFMYUYT/UTTuktNpxKVCySEdFcV6qtq+i1E+5kM0bfPYLBz+H3Vm7k6RYD6nzv76WUlXsWPFBXqqFYuNCzuIlhtUPPtWCNUS0iy9jlkaUz0LqPgxKRrl20zfF3pMf03VkjThT3yjBfKFK63ExiokMdhDWWbBX+378QADIdCu6cXYHgxxx3k/XhnWn7ESDxz/QhEoUx9g7YnaZ/Dr1lu4hCE5aYpbdm7NcurfqddJL0urzm2x6i4fRa8HYbCxDWVJzeCzMt9g5dT6/7NPHV2P+rITHb4Sbv7yVYKg1xLuRB5n9A=; grx_unique_id=19c4ad1b4ab84d09bff249caf1172c42; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga_YMS2P9FQ4X=GS1.1.1580921500.1.0.1580921500.0; _ga=GA1.2.954940161.1580921495; _px2=eyJ1IjoiYzhkZGM2NDAtNDgzNy0xMWVhLWEyMjctZTc5YjkxZjc2ZGYzIiwidiI6ImMzOTk4MjAxLTQ4MzctMTFlYS1hNGI0LTE5ZTBkN2U0OTk1NSIsInQiOjE1ODA5MjE4MDM1MTcsImgiOiJmODAyZTE2M2E5NDBiYjQzNWEyODdlMjBlNDdhN2NkODY3ZTk4YWM1NmQzN2VjOWM3NzdhOWZjOWE4MTBiYTRlIn0=; ki_t=1580921495644%3B1580921495644%3B1580921503882%3B1%3B2',
    'myrx_exp_ab_variant=experiment; csrf_token=e64425a7d50e4eaf9a7d312034002e1b; _pxhd=6ebb1b558fe2b9dde8b03c9232df732c9641decba69c3524ecc0b6393119387b:e0dc3331-4837-11ea-8d3e-9bc78ec1bc49; myrx_exp_ab_variant=experiment; variantCookie=1; _gid=GA1.2.1176016135.1580921544; _dc_gtm_UA-24914838-1=1; _gat_UA-24914838-1=1; _pxvid=e0dc3331-4837-11ea-8d3e-9bc78ec1bc49; rsci_vid=56ffdfa4-4afb-31a0-39ae-ff8c796f6d6e; ki_r=; ki_s=203440%3A0.0.0.0.0; goodrx-v2=7f02194935269e1fb06c92eef3a0fbca2f8baa5dLS6i/3FRa40THe+4fimKEHYgBYR35wXJCwbUh7GQ5c7kG2OJbR+nnR0BPPoVskrcIEwH/mzKOLkjS3HLkHZgdzlO93Hb7SjNvd8p752RYFipMhVx9v1jZKJfSGyapDlMWzpt2DUxpD8E/72TrcfLVGzv9h/a8V6YXsd20Rs6pM0JfdxwQyyRL61gr2yDAPdp4x1DmzcDuCDQGRNwOcjzRtRYAs/Yh+HRYDBbYSj195vF+SIjwYoirDitBFw9xQA8lIg5Ds74XPfevlI+xwf3mZna5taZjB8q7FrhkKubUswn5H0S72md/dntdzZcAkeTnYY3rdCPGVSRkFqfYawy4hrXn2+t9TeRBrHPLX4Yzlj+8E/leHEGOLDe29xmqRFEdp4+bmhrNcSRurLXuQXH8gDGdCTd17HXsXYVWb6eMG0TjhNRMyezABsQLuVuBvcaGpCyxu9xOYXL1DjtA1E1m9jvzKf/QPD1fJeCqHvtr3UXdHddXoCKR34yJWMzTr7J0SyUJJ2RGDErZi9ZGklnxHmDrTxFgm+Lc2Nqw/6qggqEAUUF0hFMqhQN45lXVZtKPYoO57zQh2ddGQeCljGFzr83dF0BoCZQsaL7xCPfK4ze82jg6jX2O53G1QTD2awq7+aNEJWiukDfk40GWHyw7zNTu4MlGLUia0B4+XIcaaDTkumnxdr4ZG11RjYosGHC+sX9Q1/QYsZYJZATxJAIrutVA96wYBK1yyngfCreS0id1ipFpPGHm0A=; grx_unique_id=85952bdc2ba7406fa66121d3f909e513; c=; kw=; gclid=; ppa_exp_ab_variant=experiment; _ga_YMS2P9FQ4X=GS1.1.1580921547.1.0.1580921547.0; _ga=GA1.2.24802812.1580921544; _px2=eyJ1IjoiZTQ5ODAyYjAtNDgzNy0xMWVhLTgwYmQtOGYwMzZjZTZkYzI2IiwidiI6ImUwZGMzMzMxLTQ4MzctMTFlYS04ZDNlLTliYzc4ZWMxYmM0OSIsInQiOjE1ODA5MjE4NTAxNjMsImgiOiI0Y2IwY2U4YmRiNWFhMzQ1ODE0ZWUzOTlmZWMxNDg3NzhiYmUzZDI1NDhmODgzMDVlZGI0NTEwNmMxYzFhYjhmIn0=; ki_t=1580921544918%3B1580921544918%3B1580921550557%3B1%3B2'
];

function DateFunction(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}

function comparePrices(a,b){
    if(a.price === null) return 1;
    if(b.price === null) return -1;
    if (a.price > b.price) return 1;
    if (b.price >= a.price) return -1;
}


async function sleep(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

async function getGoodRxPrices(url, options, drugId, query, values, client) {
    return await rp(options).then(async function(response) {
        var data = response;

        if (data != undefined) {
            var results = data.results;
            console.log(results);
            var CVSPrice = {};
            CVSPrice.price = null ;
            CVSPrice.pharmacy=null;
            CVSPrice.rank = 0;
            var WalmartPrice = {};
            WalmartPrice.price =  null;
            WalmartPrice.pharmacy=null;
            WalmartPrice.rank = 0;
            var WalgreenPrice = {};
            WalgreenPrice.price =  null;
            WalgreenPrice.pharmacy=null;
            WalgreenPrice.rank = 0;
            var KrogerPrice = {};
            KrogerPrice.price =  null ;
            KrogerPrice.pharmacy =null;
            KrogerPrice.rank = 0;
            var OtherPrice = {};
            OtherPrice.price =  null ;
            OtherPrice.pharmacy =null;
            OtherPrice.rank = 0;

            results.forEach(function(value){
                if(value!= null){

                    if(value.pharmacy.name.toUpperCase().includes("CVS")){

                        if(CVSPrice.price == null || CVSPrice.price > parseFloat(value.prices[0].price)){
                            CVSPrice.price =  parseFloat(value.prices[0].price);
                            CVSPrice.pharmacy=value.pharmacy.name;
                        }

                    }else if(value.pharmacy.name.toUpperCase().includes("WALMART")){
                        if(WalmartPrice.price == null ||WalmartPrice.price > parseFloat(value.prices[0].price)){
                            WalmartPrice.price =  parseFloat(value.prices[0].price);
                            WalmartPrice.pharmacy=value.pharmacy.name;
                        }

                    }else if(value.pharmacy.name.toUpperCase().includes("WALGREENS")){
                        if(WalgreenPrice.price == null ||WalgreenPrice.price > parseFloat(value.prices[0].price)){
                            WalgreenPrice.price =  parseFloat(value.prices[0].price);
                            WalgreenPrice.pharmacy=value.pharmacy.name;
                        }

                    }else if(value.pharmacy.name.toUpperCase().includes("KROGER")){
                        if(KrogerPrice.price == null ||KrogerPrice.price > parseFloat(value.prices[0].price)){
                            KrogerPrice.price =  parseFloat(value.prices[0].price);
                            KrogerPrice.pharmacy=value.pharmacy.name;
                        }

                    }else {
                        if(OtherPrice.price == null || OtherPrice.price > parseFloat(value.prices[0].price)){
                            OtherPrice.price =  parseFloat(value.prices[0].price);
                            OtherPrice.pharmacy=value.pharmacy.name;
                        }

                    }

                }
            });
            var pricesArr = [WalgreenPrice,WalmartPrice,CVSPrice,OtherPrice, KrogerPrice];
            console.log(pricesArr)
            pricesArr.sort(comparePrices)

            pricesArr[0].rank = 0;
            pricesArr[1].rank = 1;
            pricesArr[2].rank = 2;
            pricesArr[3].rank = 3;
            pricesArr[4].rank = 4;
            pricesArr.forEach(async function (price){
                const pricingData = {
                    //id : "",
                    average_price : 0.0,
                    createdat : DateFunction(),
                    difference : 0.0,
                    lowest_market_price : 0.0,
                    drug_details_id : drugId,
                    pharmacy : price.pharmacy,
                    price : price.price,
                    program_id : 6,
                    recommended_price : 0.0,
                    rank:price.rank,
                };

                // console.log("pricingData"+pricingData);

                console.log("DRUG_DETAILS_ID: " + pricingData.drug_details_id);

                query = 'INSERT INTO public_price(average_price, createdat, difference, drug_details_id, lowest_market_price, pharmacy, price, program_id, recommended_price,rank,unc_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *;'
                values = [
                    pricingData.average_price,
                    pricingData.createdat,
                    pricingData.difference,
                    pricingData.drug_details_id,
                    pricingData.lowest_market_price,
                    pricingData.pharmacy,
                    pricingData.price,
                    pricingData.program_id,
                    pricingData.recommended_price,
                    pricingData.rank,
                    null
                ];

                // console.log(values[0]);

                // PLACE PRICE RESULT INTO PUBLIC_PRICE TABLE
                await client.query(query, values)
                    .then((response) => {
                        // console.log("Success: " + drugId);
                        return response;
                    })
                    .catch((error) => console.log(error));
            });


            var query3 = 'UPDATE shuffle_drugs SET goodrx_flag = \'completed\' WHERE request_id = $1';
            values = [drugId];
            await client.query(query3, values)
                .then(() => {
                    console.log('Updated shuffle_drugs' + drugId);
                }).catch((error) => console.log(error));


        }
    }).catch(function(error) {
        console.log("Failure: " + drugId);
        console.log("URL: " + url)
        return "ERROR";
    })
}

let cookieCount = 0;
var cookieTemp =cookies[0];

exports.handler = async function(event, context) {
    var drugId = "";
    var url = "";
    var query2 = "";
    var values = "";

    // CONNECT TO POSTGRES DB
    const connectionString = db_host;
    const client = new Client({
        connectionString: connectionString
    });
    client.connect();

    let drugList = [];

    var response = await client.query("SELECT request_id FROM shuffle_drugs where goodrx_flag = 'pending' and region = '" + reg + "';");
    for (var i = 0; i < response.rows.length; i++) {
        drugList.push(response.rows[i].request_id);
    }

    var a = 0;
    let len = drugList.length;
    // console.log(len);

    let priceCount = 0;

    for (var k = 0; k < len; k++) {



        //cookie code&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
        if ((k) % 30 === 0) {
            cookieTemp = cookies[cookieCount++];
            console.log(k)
        }

        // console.log(drugList[k]);
        var req = await client.query("SELECT * FROM drug_request where program_id = 6 and good_rx_id is not null and drug_name is not null and latitude is not null and longitude is not null and quantity is not null and drug_id :: int = " + drugList[k]);
        // console.log(req.rows.length);
        if(req.rows.length >= 1) {
            drugId = req.rows[0].drug_id;
            // console.log("CHECKING:::" + drugId);
            var drugName = req.rows[0].drug_name;
            var latitude = req.rows[0].latitude;
            var longitude = req.rows[0].longitude;
            var brand = req.rows[0].brand_indicator;
            var quantity = req.rows[0].quantity;
            var grxId = req.rows[0].good_rx_id;

            url = `https://goodrx.com/api/v4/drugs/${grxId}/prices?location=${longitude},${latitude}&location_type=LAT_LNG_GEO_IP&quantity=${quantity}`;

            const options = {
                url: url,
                method: 'GET',
                json: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Connection": "keep-alive",
                    "User-Agent": "PostmanRuntime/7.16.3",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Cookie": cookieTemp,
                    "GRX-API-Client-ID": "8f9b4435-0377-46d7-a898-e1b656649408",
                    "GRX-API-Version": "2017-11-17",
                    "DNT": 1
                }
            };

            if ((k ) % 29 === 0) {
                console.log("About to be blocked, waiting...")
                await sleep(60000);
                console.log("Waited 1min")
            }

            try {
                // MAKE GOODRX API REQUEST
                var res;
                res = await getGoodRxPrices(url, options, drugId, query2, values, client);

                priceCount = priceCount + 1;
            } catch (error) {
                console.log(error);
            }
            if (context.getRemainingTimeInMillis() < 30000) {
                process.exit(0);
            }
        }

        // var query3 = 'SELECT * FROM public_price WHERE program_id = 6';
        // await client.query(query3).then((response) => {
        //     console.log(response.rows.length)
        // }).catch((error) => console.log(error));
        // }
    } console.log(priceCount);
}