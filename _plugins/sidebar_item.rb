module Jekyll
  module SidebarItemFilter
    def sidebar_item_link(item)
      pageID = @context.registers[:page]["id"]
      itemID = item["name"]
      href = item["href"] || "/#{item["collection"]}/#{itemID}"
      className = pageID == itemID ? ' class="active"' : ''

      return "<a href=\"#{href}\"#{className}>#{item["title"]}</a>"
    end
  end
end

Liquid::Template.register_filter(Jekyll::SidebarItemFilter)