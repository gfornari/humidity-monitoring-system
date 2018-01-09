.DEFAULT_GOAL := default
MAKEFLAGS += --silent
TEX = pdflatex

.PHONY: default clean 

clean:
	rm -f *.aux *.log

default:
	$(TEX) main.tex