import json
import sys

def main():
    try:
        with open('lighthouse.json', 'r') as f:
            data = json.load(f)
            
        audits = data.get('audits', {})
        
        # 1. LCP Value
        lcp = audits.get('largest-contentful-paint', {})
        print(f"LCP Value: {lcp.get('displayValue', 'Unknown')}")
        print(f"LCP Score: {lcp.get('score', 'Unknown')}")
        print("-" * 40)
        
        # 2. LCP Element
        lcp_el = audits.get('largest-contentful-paint-element', {})
        print("LCP Element:")
        if 'details' in lcp_el and 'items' in lcp_el['details']:
            for item in lcp_el['details']['items']:
                node = item.get('node', {})
                print(f"  Tag: {node.get('nodeLabel')}")
                print(f"  Selector: {node.get('selector')}")
                print(f"  Snippet: {node.get('snippet')}")
        else:
            print("  Not found in trace.")
        print("-" * 40)
        
        # 3. LCP Breakdown (if available) - lighthouse might not have 'lcp-breakdown' but 'metrics' has some stuff
        # Wait, the log said "Auditing: LCP breakdown" and "Auditing: LCP request discovery"
        # So we can look for 'lcp-breakdown' in audits.
        lcp_breakdown = audits.get('lcp-breakdown', {})
        print("LCP Breakdown:")
        if 'details' in lcp_breakdown and 'items' in lcp_breakdown['details']:
             for item in lcp_breakdown['details']['items']:
                 print(f"  TTFB: {item.get('ttfb')} ms")
                 print(f"  Resource Load Delay: {item.get('loadDelay')} ms")
                 print(f"  Resource Load Duration: {item.get('loadTime')} ms")
                 print(f"  Element Render Delay: {item.get('renderDelay')} ms")
        else:
             print("  Not available.")
             
        print("-" * 40)
        
        # 4. Render blocking resources
        render_blocking = audits.get('render-blocking-resources', {})
        print(f"Render Blocking Resources ({render_blocking.get('displayValue', 'None')}):")
        if 'details' in render_blocking and 'items' in render_blocking['details']:
            for item in render_blocking['details']['items']:
                print(f"  URL: {item.get('url')}")
                print(f"  Wasted Time: {item.get('wastedMs')} ms")
        
        print("-" * 40)
        
        # 5. Preload / Fetchpriority issues (lcp-discovery)
        lcp_discovery = audits.get('lcp-discovery', {})
        print("LCP Discovery:")
        if lcp_discovery.get('details') and 'items' in lcp_discovery['details']:
             for item in lcp_discovery['details']['items']:
                 print(f"  URL: {item.get('url')}")
                 print(f"  Savings: {item.get('wastedMs')} ms")
        
    except Exception as e:
        print(f"Error parsing JSON: {e}")

if __name__ == '__main__':
    main()
