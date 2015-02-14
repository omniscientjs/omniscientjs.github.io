module Jekyll
  class CodeBlock < Liquid::Block

    @@num = 0;

    def initialize(tag_name, arg, tokens)
      super
    end

    def render(context)
      @@num = @@num + 1;

      content = super.to_s
                  .gsub(/\A(\n|\r)+|(\n|\r)+\z/, '')
                  .gsub(/RESULT/, "'editor-#{@@num}'")

      return "<div class='window'>"\
        "<div class='control'><ul><li></li><li></li><li></li></ul></div>"\
        "<div id='editor-#{@@num}' class='inner inner--result'></div>"\
        "<div class='inner inner--code'>"\
          "<textarea class='editor'>#{content}</textarea>"\
          "</div>"\
      "</div>"
    end
  end
end

Liquid::Template.register_tag('code', Jekyll::CodeBlock)
