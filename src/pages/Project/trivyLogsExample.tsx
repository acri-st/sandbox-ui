export const trivyLogsExample = 
`&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8"&gt;
    &lt;style&gt;
      * {
        font-family: Arial, Helvetica, sans-serif;
      }
      h1 {
        text-align: center;
      }
      .group-header th {
        font-size: 200%;
      }
      .sub-header th {
        font-size: 150%;
      }
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
        white-space: nowrap;
        padding: .3em;
      }
      table {
        margin: 0 auto;
      }
      .severity {
        text-align: center;
        font-weight: bold;
        color: #fafafa;
      }
      .severity-LOW .severity { background-color: #5fbb31; }
      .severity-MEDIUM .severity { background-color: #e9c600; }
      .severity-HIGH .severity { background-color: #ff8800; }
      .severity-CRITICAL .severity { background-color: #e40000; }
      .severity-UNKNOWN .severity { background-color: #747474; }
      .severity-LOW { background-color: #5fbb3160; }
      .severity-MEDIUM { background-color: #e9c60060; }
      .severity-HIGH { background-color: #ff880060; }
      .severity-CRITICAL { background-color: #e4000060; }
      .severity-UNKNOWN { background-color: #74747460; }
      table tr td:first-of-type {
        font-weight: bold;
      }
      .links a,
      .links[data-more-links=on] a {
        display: block;
      }
      .links[data-more-links=off] a:nth-of-type(1n+5) {
        display: none;
      }
      a.toggle-more-links { cursor: pointer; }
    &lt;/style&gt;
    &lt;title&gt;2n567881.c1.de1.container-registry.ovh.net/desp-aas-projects-prod/postpatch_test/dockerfile:5970536c (debian 12.6) - Trivy Report - 2025-04-15 14:51:41.340190858 +0000 UTC m=+0.441538359 &lt;/title&gt;
    &lt;script&gt;
      window.onload = function() {
        document.querySelectorAll('td.links').forEach(function(linkCell) {
          var links = [].concat.apply([], linkCell.querySelectorAll('a'));
          [].sort.apply(links, function(a, b) {
            return a.href &gt; b.href ? 1 : -1;
          });
          links.forEach(function(link, idx) {
            if (links.length &gt; 3 &amp;&amp; 3 === idx) {
              var toggleLink = document.createElement('a');
              toggleLink.innerText = "Toggle more links";
              toggleLink.href = "#toggleMore";
              toggleLink.setAttribute("class", "toggle-more-links");
              linkCell.appendChild(toggleLink);
            }
            linkCell.appendChild(link);
          });
        });
        document.querySelectorAll('a.toggle-more-links').forEach(function(toggleLink) {
          toggleLink.onclick = function() {
            var expanded = toggleLink.parentElement.getAttribute("data-more-links");
            toggleLink.parentElement.setAttribute("data-more-links", "on" === expanded ? "off" : "on");
            return false;
          };
        });
      };
    &lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;2n567881.c1.de1.container-registry.ovh.net/desp-aas-projects-prod/postpatch_test/dockerfile:5970536c (debian 12.6) - Trivy Report - 2025-04-15 14:51:41.340237546 +0000 UTC m=+0.441585039&lt;/h1&gt;
    &lt;table&gt;
      &lt;tr class="group-header"&gt;&lt;th colspan="6"&gt;debian&lt;/th&gt;&lt;/tr&gt;
      &lt;tr class="sub-header"&gt;
        &lt;th&gt;Package&lt;/th&gt;
        &lt;th&gt;Vulnerability ID&lt;/th&gt;
        &lt;th&gt;Severity&lt;/th&gt;
        &lt;th&gt;Installed Version&lt;/th&gt;
        &lt;th&gt;Fixed Version&lt;/th&gt;
        &lt;th&gt;Links&lt;/th&gt;
      &lt;/tr&gt;
      &lt;tr class="severity-CRITICAL"&gt;
        &lt;td class="pkg-name"&gt;zlib1g&lt;/td&gt;
        &lt;td&gt;CVE-2023-45853&lt;/td&gt;
        &lt;td class="severity"&gt;CRITICAL&lt;/td&gt;
        &lt;td class="pkg-version"&gt;1:1.2.13.dfsg-1&lt;/td&gt;
        &lt;td&gt;&lt;/td&gt;
        &lt;td class="links" data-more-links="off"&gt;
          &lt;a href="http://www.openwall.com/lists/oss-security/2023/10/20/9"&gt;http://www.openwall.com/lists/oss-security/2023/10/20/9&lt;/a&gt;
          &lt;a href="http://www.openwall.com/lists/oss-security/2024/01/24/10"&gt;http://www.openwall.com/lists/oss-security/2024/01/24/10&lt;/a&gt;
          &lt;a href="https://access.redhat.com/security/cve/CVE-2023-45853"&gt;https://access.redhat.com/security/cve/CVE-2023-45853&lt;/a&gt;
          &lt;a href="https://chromium.googlesource.com/chromium/src/+/d709fb23806858847131027da95ef4c548813356"&gt;https://chromium.googlesource.com/chromium/src/+/d709fb23806858847131027da95ef4c548813356&lt;/a&gt;
          &lt;a href="https://chromium.googlesource.com/chromium/src/+/de29dd6c7151d3cd37cb4cf0036800ddfb1d8b61"&gt;https://chromium.googlesource.com/chromium/src/+/de29dd6c7151d3cd37cb4cf0036800ddfb1d8b61&lt;/a&gt;
          &lt;a href="https://github.com/madler/zlib/blob/ac8f12c97d1afd9bafa9c710f827d40a407d3266/contrib/README.contrib#L1-L4"&gt;https://github.com/madler/zlib/blob/ac8f12c97d1afd9bafa9c710f827d40a407d3266/contrib/README.contrib#L1-L4&lt;/a&gt;
          &lt;a href="https://github.com/madler/zlib/commit/73331a6a0481067628f065ffe87bb1d8f787d10c"&gt;https://github.com/madler/zlib/commit/73331a6a0481067628f065ffe87bb1d8f787d10c&lt;/a&gt;
          &lt;a href="https://github.com/madler/zlib/pull/843"&gt;https://github.com/madler/zlib/pull/843&lt;/a&gt;
          &lt;a href="https://github.com/smihica/pyminizip"&gt;https://github.com/smihica/pyminizip&lt;/a&gt;
          &lt;a href="https://github.com/smihica/pyminizip/blob/master/zlib-1.2.11/contrib/minizip/zip.c"&gt;https://github.com/smihica/pyminizip/blob/master/zlib-1.2.11/contrib/minizip/zip.c&lt;/a&gt;
          &lt;a href="https://lists.debian.org/debian-lts-announce/2023/11/msg00026.html"&gt;https://lists.debian.org/debian-lts-announce/2023/11/msg00026.html&lt;/a&gt;
          &lt;a href="https://nvd.nist.gov/vuln/detail/CVE-2023-45853"&gt;https://nvd.nist.gov/vuln/detail/CVE-2023-45853&lt;/a&gt;
          &lt;a href="https://pypi.org/project/pyminizip/#history"&gt;https://pypi.org/project/pyminizip/#history&lt;/a&gt;
          &lt;a href="https://security.gentoo.org/glsa/202401-18"&gt;https://security.gentoo.org/glsa/202401-18&lt;/a&gt;
          &lt;a href="https://security.netapp.com/advisory/ntap-20231130-0009"&gt;https://security.netapp.com/advisory/ntap-20231130-0009&lt;/a&gt;
          &lt;a href="https://security.netapp.com/advisory/ntap-20231130-0009/"&gt;https://security.netapp.com/advisory/ntap-20231130-0009/&lt;/a&gt;
          &lt;a href="https://ubuntu.com/security/notices/USN-7107-1"&gt;https://ubuntu.com/security/notices/USN-7107-1&lt;/a&gt;
          &lt;a href="https://www.cve.org/CVERecord?id=CVE-2023-45853"&gt;https://www.cve.org/CVERecord?id=CVE-2023-45853&lt;/a&gt;
          &lt;a href="https://www.winimage.com/zLibDll/minizip.html"&gt;https://www.winimage.com/zLibDll/minizip.html&lt;/a&gt;
        &lt;/td&gt;
      &lt;/tr&gt;
      &lt;tr&gt;&lt;th colspan="6"&gt;No Misconfigurations found&lt;/th&gt;&lt;/tr&gt;
    &lt;/table&gt;
  &lt;/body&gt;
&lt;/html&gt;
`