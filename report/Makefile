.DEFAULT_GOAL := default
MAKEFLAGS += --silent
TEX = pdflatex
BIB = bibtex

.PHONY: default clean 

clean:
	rm -f *.aux *.log

default:
	$(TEX) main.tex
	$(BIB) main.aux
	$(TEX) main.tex
	$(TEX) main.tex